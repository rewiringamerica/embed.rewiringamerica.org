import ProjectIcon from 'jsx:../static/icons/project.svg';
import React, { forwardRef, useState } from 'react';
import {
  AmountUnit,
  Incentive,
  IncentiveType,
} from './api/calculator-types-v1';
import { getYear, isInFuture } from './api/dates';
import { Card } from './card';
import { Option, Select } from './components/select';
import { str } from './i18n/str';
import { MsgFn, useTranslated } from './i18n/use-translated';
import { IncentiveCard } from './incentive-card';
import { IRARebate } from './ira-rebates';
import { itemName } from './item-name';
import { PROJECT_ICONS } from './project-icons';
import { PROJECTS, Project } from './projects';
import { safeLocalStorage } from './safe-local-storage';
import { STATES } from './states';

const formatUnit = (unit: AmountUnit, msg: MsgFn) =>
  unit === 'btuh10k'
    ? msg('10,000 Btuh')
    : unit === 'kilowatt'
    ? msg('kilowatt')
    : unit === 'kilowatt_hour'
    ? msg('kilowatt-hour')
    : unit === 'square_foot'
    ? msg('square foot')
    : unit === 'ton'
    ? msg('ton')
    : unit === 'watt'
    ? msg('watt')
    : unit;

const formatTitle = (incentive: Incentive, msg: MsgFn, project: Project) => {
  const item = itemName(incentive.items, msg, project);
  if (!item) {
    return null;
  }

  const amount = incentive.amount;
  if (amount.type === 'dollar_amount') {
    return amount.maximum
      ? msg(str`Up to $${amount.maximum.toLocaleString()} off ${item}`, {
          desc: 'e.g. "up to $3000 off a heat pump',
        })
      : msg(str`$${amount.number.toLocaleString()} off ${item}`, {
          desc: 'e.g. "$3000 off a heat pump"',
        });
  } else if (amount.type === 'percent') {
    const percentStr = `${Math.round(amount.number * 100)}%`;
    return amount.maximum
      ? msg(
          str`${percentStr} of cost of ${item}, up to $${amount.maximum.toLocaleString()}`,
          {
            desc: 'e.g. "50% of cost of a heat pump, up to $3000"',
          },
        )
      : msg(str`${percentStr} of cost of ${item}`, {
          desc: 'e.g. "50% of cost of a heat pump"',
        });
  } else if (amount.type === 'dollars_per_unit') {
    return amount.maximum
      ? msg(
          str`$${amount.number.toLocaleString()}/${formatUnit(
            amount.unit!,
            msg,
          )} off ${item}, up to $${amount.maximum.toLocaleString()}`,
          {
            desc: 'e.g. "$1000/ton off a heat pump, up to $3000"',
          },
        )
      : msg(
          str`$${amount.number.toLocaleString()}/${formatUnit(
            amount.unit!,
            msg,
          )} off ${item}`,
          {
            desc: 'e.g. "$1000/ton off a heat pump',
          },
        );
  } else {
    return null;
  }
};

const formatIncentiveType = (payment_methods: IncentiveType[], msg: MsgFn) =>
  payment_methods[0] === 'tax_credit'
    ? msg('Tax credit')
    : payment_methods[0] === 'pos_rebate'
    ? msg('Upfront discount')
    : payment_methods[0] === 'rebate'
    ? msg('Rebate')
    : payment_methods[0] === 'account_credit'
    ? msg('Account credit')
    : payment_methods[0] === 'performance_rebate'
    ? msg('Performance rebate')
    : msg('Incentive');

const getStartYearIfInFuture = (incentive: Incentive) =>
  incentive.start_date && isInFuture(incentive.start_date, new Date())
    ? getYear(incentive.start_date)
    : null;

const ComingSoonCard = ({ state }: { state: string }) => {
  const { msg } = useTranslated();

  // Show link to The Switch is On for states where they have good coverage.
  const url = new URL('https://incentives.switchison.org/residents/incentives');
  url.searchParams.set('state', state);
  url.searchParams.set('utm_source', 'partner');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'rewiring_america');
  const body =
    state === 'CA' || state === 'WA' ? (
      <>
        {msg(
          str`While we don't have detailed state and local utility coverage \
for ${STATES[state].name(msg)},`,
          { desc: 'followed by "The Switch is On is a ...' },
        )}{' '}
        <a
          className="text-color-action-primary hover:underline"
          href={url.toString()}
          target="_blank"
        >
          The Switch is On
        </a>{' '}
        {msg(
          `is a comprehensive resource that includes detailed information for your state.`,
          { desc: 'preceded by "The Switch is On", name of an organization' },
        )}
      </>
    ) : (
      msg(
        `You can take advantage of federal incentives now, but your state, \
city, and utility may also provide incentives for this project. We’re working \
hard to identify each one!`,
      )
    );

  return (
    <Card theme="grey" padding="medium">
      <h3 className="text-color-text-primary text-center text-xl font-medium leading-tight">
        {msg('More money coming soon!')}
      </h3>
      <p className="text-color-text-primary text-center text-base leading-normal">
        {body}
      </p>
    </Card>
  );
};

const renderSelectProjectCard = () => {
  const { msg } = useTranslated();
  return (
    <Card theme="grey" padding="large">
      <ProjectIcon
        className="mx-auto text-grey-500"
        width={120}
        height={120}
        aria-hidden={true}
      />
      <h3 className="text-center text-xl text-grey-600 font-medium leading-tight">
        {msg('Select a project')}
      </h3>
      <p className="text-center text-base leading-normal">
        {msg('To view your eligible savings programs, select a project above.')}
      </p>
    </Card>
  );
};

type CardCollectionProps = {
  incentives: Incentive[];
  iraRebates: IRARebate[];
  coverageState: string | null;
  locationState: string;
  project: Project;
};
export const CardCollection: React.FC<CardCollectionProps> = ({
  incentives,
  iraRebates,
  coverageState,
  locationState,
  project,
}) => {
  const { msg } = useTranslated();
  return (
    <div className="flex flex-col gap-4">
      {incentives
        // Sort incentives that haven't started yet at the end
        .sort(
          (a, b) =>
            (getStartYearIfInFuture(a) ?? 0) - (getStartYearIfInFuture(b) ?? 0),
        )
        .map((incentive, index) => {
          const headline = formatTitle(incentive, msg, project);
          if (!headline) {
            // We couldn't generate a headline either because the items are
            // unknown, or the amount type is unknown. Don't show a card.
            return null;
          }

          const futureStartYear = getStartYearIfInFuture(incentive);
          // The API cannot precisely tell, from zip code alone, whether the
          // user is in a specific city or county; it takes a permissive
          // approach and returns incentives for localities the user *might* be
          // in. So this indicates that the user should check for themselves.
          //
          // This is a blunt-instrument approach; in many cases there's actually
          // no ambiguity as to which city or county a zip code is in, but the
          // API currently doesn't take that into account.
          const locationEligibilityText = ['city', 'county', 'other'].includes(
            incentive.authority_type,
          )
            ? msg('Eligibility depends on residence location.')
            : '';

          const [buttonUrl, buttonText] = incentive.more_info_url
            ? [incentive.more_info_url, msg('Learn more')]
            : [
                incentive.program_url,
                futureStartYear ? msg('Learn more') : msg('Learn how to apply'),
              ];
          return (
            <IncentiveCard
              key={`incentive${index}`}
              typeChip={formatIncentiveType(incentive.payment_methods, msg)}
              headline={headline}
              subHeadline={incentive.program}
              body={`${incentive.short_description} ${locationEligibilityText}`}
              warningChip={
                futureStartYear
                  ? msg(str`Expected in ${futureStartYear}`)
                  : null
              }
              buttonUrl={buttonUrl}
              buttonText={buttonText}
            />
          );
        })
        .concat(
          iraRebates.map((rebate, index) => (
            <IncentiveCard
              key={`ira${index}`}
              typeChip={formatIncentiveType([rebate.paymentMethod], msg)}
              headline={rebate.headline}
              subHeadline={rebate.program}
              body={rebate.description}
              warningChip={rebate.timeline}
              buttonUrl={rebate.url}
              buttonText={msg('Learn more')}
            />
          )),
        )}
      {coverageState === null && <ComingSoonCard state={locationState} />}
    </div>
  );
};

type IncentiveGridProps = {
  incentivesByProject: Record<Project, Incentive[]>;
  iraRebatesByProject: Record<Project, IRARebate[]>;
  coverageState: string | null;
  locationState: string;
  tabs: { project: Project; count: number }[];
};

export const IncentiveGrid = forwardRef<HTMLDivElement, IncentiveGridProps>(
  (
    {
      incentivesByProject,
      iraRebatesByProject,
      coverageState,
      locationState,
      tabs,
    },
    ref,
  ) => {
    const { msg } = useTranslated();

    // If a project selection is saved in local storage AND that project has
    // nonzero incentives, select that project.
    //
    // Otherwise, select the first project in the menu (which, by virtue of the
    // sorting above, will have incentives unless there are zero results total).
    const [projectTab, setProjectTab] = useState(() => {
      const storedProject = safeLocalStorage.getItem(
        SELECTED_PROJECT_LOCAL_STORAGE_KEY,
      );

      if (
        storedProject !== null &&
        incentivesByProject[storedProject]?.length > 0
      ) {
        return storedProject;
      } else {
        safeLocalStorage.removeItem(SELECTED_PROJECT_LOCAL_STORAGE_KEY);
        return null;
      }
    });

    const options: Option<Project>[] = tabs.map(({ project, count }) => ({
      value: project,
      label: PROJECTS[project].label(msg),
      getIcon: PROJECT_ICONS[project],
      badge: count,
      disabled: count === 0,
    }));

    return (
      <>
        <div className="min-w-50" ref={ref}>
          <Select
            id="project-selector"
            labelText={msg('Project', { desc: 'label for a selector input' })}
            hiddenLabel={true}
            placeholder={msg('Select project…')}
            currentValue={projectTab}
            options={options}
            onChange={project => {
              safeLocalStorage.setItem(
                SELECTED_PROJECT_LOCAL_STORAGE_KEY,
                project,
              );
              setProjectTab(project);
            }}
          />
        </div>
        {projectTab !== null ? (
          <CardCollection
            incentives={incentivesByProject[projectTab]}
            iraRebates={iraRebatesByProject[projectTab]}
            coverageState={coverageState}
            locationState={locationState}
            project={projectTab}
          />
        ) : (
          renderSelectProjectCard()
        )}
      </>
    );
  },
);

/**
 * If you make a backward-incompatible change to the format of form value
 * storage, increment the version in this key.
 */
const SELECTED_PROJECT_LOCAL_STORAGE_KEY = 'RA-calc-selected-project-v1';
declare module './safe-local-storage' {
  interface SafeLocalStorageMap {
    [SELECTED_PROJECT_LOCAL_STORAGE_KEY]: Project;
  }
}
