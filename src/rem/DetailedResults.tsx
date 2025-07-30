import { FC, useEffect, useRef } from 'react';
import { Quantiles, RemAddressResponse } from '../api/rem-types';
import { str } from '../i18n/str';
import { useTranslated } from '../i18n/use-translated';
import { NumberLine } from './NumberLine';

const renderNumber = (n: number): string =>
  Math.abs(Math.round(n)).toLocaleString();

const ImpactCard: FC<{
  title: string;
  description: string;
  quantiles: Quantiles;
  unit: 'dollars' | 'kgCO2e';
}> = ({ title, description, quantiles, unit }) => (
  <div className="flex flex-col p-3 gap-6 bg-white rounded-lg border border-grey-200">
    <h3 className="font-medium leading-tight">{title}</h3>
    <p className="leading-normal">{description}</p>
    <NumberLine
      left={quantiles.percentile_80.value}
      middle={quantiles.median.value}
      right={quantiles.percentile_20.value}
      zeroLabel={unit === 'dollars' ? '$0' : '0kg'}
      renderEnds={
        unit === 'dollars'
          ? n => `$${renderNumber(n)}`
          : n => `${renderNumber(n)}kg`
      }
      renderMiddle={
        unit === 'dollars'
          ? n => `$${renderNumber(n)}/yr`
          : n => (
              <>
                {renderNumber(n)}kg CO<sub>2</sub>e/yr
              </>
            )
      }
    />
  </div>
);

export const DetailedResults: FC<{ savings: RemAddressResponse }> = ({
  savings,
}) => {
  const { msg } = useTranslated();

  const costResult = savings.fuel_results.total.delta.cost;
  const emissionsResult = savings.fuel_results.total.delta.emissions;

  const renderDollarDiff = (n: number) =>
    n <= 0
      ? msg(str`$${renderNumber(n)} less`)
      : msg(str`$${renderNumber(n)} more`);

  const renderKgDiff = (n: number) =>
    n <= 0
      ? msg(str`${renderNumber(n)}kg less`)
      : msg(str`${renderNumber(n)}kg more`);

  const costDescription =
    costResult.percentile_80.value <= 0
      ? // Good case: all parts of the range are saving
        msg(
          str`Our modeling shows that homes like yours will tend to save between $${renderNumber(
            costResult.percentile_80.value,
          )} and $${renderNumber(
            costResult.percentile_20.value,
          )} a year on their energy bills, with most homes saving at least $${renderNumber(
            costResult.median.value,
          )}.`,
        )
      : // Bad case: at least some part of the range is not saving.
      // Phrase differently depending on which way the median goes.
      costResult.median.value <= 0
      ? msg(
          str`Our modeling shows that homes like yours will tend to spend between ${renderDollarDiff(
            Math.min(
              costResult.percentile_20.value,
              costResult.percentile_80.value,
            ),
          )} and ${renderDollarDiff(
            Math.max(
              costResult.percentile_20.value,
              costResult.percentile_80.value,
            ),
          )} per year, with most homes saving at least $${renderNumber(
            costResult.median.value,
          )}.`,
        )
      : msg(
          str`Our modeling shows that homes like yours will tend to spend between ${renderDollarDiff(
            Math.min(
              costResult.percentile_20.value,
              costResult.percentile_80.value,
            ),
          )} and ${renderDollarDiff(
            Math.max(
              costResult.percentile_20.value,
              costResult.percentile_80.value,
            ),
          )} per year, with most homes spending at least $${renderNumber(
            costResult.median.value,
          )} more.`,
        );

  const emissionsDescription =
    emissionsResult.percentile_80.value <= 0
      ? // Good case: all parts of the range are saving
        msg(
          str`Our modeling shows that homes like yours will tend to have annual emissions reductions between ${renderNumber(
            emissionsResult.percentile_80.value,
          )}kg and ${renderNumber(
            emissionsResult.percentile_20.value,
          )}kg, with most homes reducing emissions by at least ${renderNumber(
            emissionsResult.median.value,
          )}kg.`,
        )
      : // Bad case: at least some part of the range is not saving.
      // Phrase differently depending on which way the median goes.
      emissionsResult.median.value <= 0
      ? msg(
          str`Our modeling shows that homes like yours will tend to emit between ${renderKgDiff(
            Math.min(
              emissionsResult.percentile_20.value,
              emissionsResult.percentile_80.value,
            ),
          )} and ${renderKgDiff(
            Math.max(
              emissionsResult.percentile_20.value,
              emissionsResult.percentile_80.value,
            ),
          )} per year, with most homes reducing emissions by at least ${renderNumber(
            emissionsResult.median.value,
          )}kg.`,
        )
      : msg(
          str`Our modeling shows that homes like yours will tend to emit between ${renderKgDiff(
            emissionsResult.percentile_80.value,
          )} and ${renderKgDiff(
            emissionsResult.percentile_20.value,
          )} per year, with most homes increasing emissions by at least ${renderNumber(
            emissionsResult.median.value,
          )}kg.`,
        );

  const costCard = (
    <ImpactCard
      title={msg('Energy bill impact')}
      description={costDescription}
      quantiles={costResult}
      unit="dollars"
    />
  );

  const emissionsCard = (
    <ImpactCard
      title={msg('Emissions impact')}
      description={emissionsDescription}
      quantiles={emissionsResult}
      unit="kgCO2e"
    />
  );

  // Focus the header on mount, to put screen readers on it
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    headerRef.current?.focus();
  });

  return (
    <div className="flex flex-col gap-4 p-4 bg-grey-100">
      <div>
        <h2
          ref={headerRef}
          className="font-medium leading-normal mb-1"
          tabIndex={-1}
        >
          {msg('Bill and emissions impact')}
        </h2>
        <p className="text-sm leading-normal">
          {msg(
            `We calculated the impact estimates below based on your selected \
upgrade, the household info you shared, and other characteristics we found \
for this home.`,
          )}
        </p>
      </div>
      {costCard}
      {emissionsCard}
    </div>
  );
};
