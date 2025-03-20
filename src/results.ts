import { APIResponse, Incentive } from './api/calculator-types-v1';
import { MsgFn } from './i18n/use-translated';
import { IRARebate, getRebatesFor } from './ira-rebates';
import { PROJECTS, Project } from './projects';

export type Results = {
  incentivesByProject: Record<Project, Incentive[]>;
  iraRebatesByProject: Record<Project, IRARebate[]>;
  projectOptions: { project: Project; count: number }[];
  totalResults: number;
  countOfProjects: number;
};

export function getResultsForDisplay(
  response: APIResponse,
  msg: MsgFn,
  projectFilter: Project[],
): Results {
  const projects = Object.fromEntries(
    Object.entries(PROJECTS).filter(([project]) => {
      // Filter project types, when provided by the client
      if (projectFilter.length > 0) {
        return projectFilter.includes(project as Project);
      }
      return true;
    }),
  );

  const incentivesByProject = Object.fromEntries(
    Object.entries(projects).map(([project, projectInfo]) => [
      project,
      response.incentives.filter(incentive =>
        incentive.items.some(item => projectInfo.items.includes(item)),
      ),
    ]),
  ) as Record<Project, Incentive[]>;

  const iraRebates = getRebatesFor(response, msg);
  const iraRebatesByProject = Object.fromEntries(
    Object.keys(projects).map(project => [
      project,
      iraRebates.filter(rebate => rebate.project === project),
    ]),
  ) as Record<Project, IRARebate[]>;

  // Sort projects with nonzero incentives first, then alphabetically.
  const projectOptions = (Object.keys(projects) as Project[])
    .map(project => {
      const count =
        incentivesByProject[project].length +
        iraRebatesByProject[project].length;

      // The string "false" compares before "true"
      const sortKey = `${count === 0} ${projects[project].label(msg)}`;

      return { project, count, sortKey };
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const totalResults = projectOptions.reduce((acc, opt) => acc + opt.count, 0);
  const countOfProjects = projectOptions.filter(opt => opt.count > 0).length;

  return {
    incentivesByProject,
    iraRebatesByProject,
    projectOptions,
    totalResults,
    countOfProjects,
  };
}
