import clsx from 'clsx';
import { FC, ReactNode } from 'react';

const Triangle: FC<{ up: boolean }> = ({ up }) =>
  up ? (
    <span className="text-red-500">{'\u25b2'}&nbsp;</span>
  ) : (
    <span className="text-green-500">{'\u25bc'}&nbsp;</span>
  );

export const NumberLine: FC<{
  left: number;
  middle: number;
  right: number;

  zeroLabel: string;
  renderEnds: (n: number) => ReactNode;
  renderMiddle: (n: number) => ReactNode;
}> = ({ left, middle, right, zeroLabel, renderEnds, renderMiddle }) => {
  const middleBubble = (
    <div className="mx-auto bg-purple-100 rounded-lg px-4 py-1 text-lg leading-8">
      <Triangle up={middle > 0} />
      {renderMiddle(middle)}
    </div>
  );

  // A triangle with a right angle at the bottom
  const bubbleArrow = (
    <div className="mx-auto text-purple-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="8"
        viewBox="0 0 16 8"
      >
        <path d="M0 0 h 16 L 8 8 Z" fill="currentColor" />
      </svg>
    </div>
  );

  // There are 5 cases for the bar:
  //
  // 1. All negative: full width green
  // 2. p20 positive, median and p80 negative: 1/4 red, zero mark, 3/4 green
  // 3. p20 positive, median zero, p80 negative: 1/2 red, no mark, 1/2 green
  // 4. p20 and median positive, p80 negative: 3/4 red, zero mark, 1/4 green
  // 5. All positive: full width red
  //
  // This, plus the labels below it, are implemented with a 3-column 2-row grid.

  const gridColClasses =
    (left <= 0 && right <= 0) || (left > 0 && right > 0)
      ? // p20 and p80 are the same sign: suppress zero mark
        'grid-cols-[auto_0_auto]'
      : middle < 0
      ? // Mixed case, negative median: zero mark on left
        'gap-x-[0.185rem] grid-cols-[25%_0.125rem_auto]'
      : middle === 0
      ? // Mixed case, zero median: suppress zero mark
        'grid-cols-[auto_0_auto]'
      : // Mixed case, positive median: zero mark on right
        'gap-x-[0.185rem] grid-cols-[auto_0.125rem_25%]';

  const lineAndLabels = (
    <div
      className={clsx(
        'grid grid-rows-[0.75rem_auto] relative mt-1',
        gridColClasses,
      )}
    >
      <div
        className={clsx(
          'h-1 my-auto rounded-sm',
          left <= 0 ? 'bg-green-500' : 'bg-red-500',
        )}
      ></div>
      <div className="h-[0.625rem] my-auto bg-grey-400"></div>
      <div
        className={clsx(
          'h-1 my-auto rounded-sm',
          right <= 0 ? 'bg-green-500' : 'bg-red-500',
        )}
      ></div>

      <div className="text-xsm font-medium leading-tight text-grey-400">
        <Triangle up={left > 0} />
        {renderEnds(left)}
      </div>
      <div className="text-xsm font-medium leading-tight text-grey-400 w-fit -translate-x-1/2">
        {
          // Only show a zero label if there's a zero mark: the two ends have
          // opposite signs, and the median is nonzero.
          left <= 0 !== right <= 0 && middle !== 0 ? zeroLabel : null
        }
      </div>
      <div className="text-xsm font-medium leading-tight text-grey-400 text-right">
        <Triangle up={right > 0} />
        {renderEnds(right)}
      </div>

      <div className="absolute row-start-1 left-1/2 -translate-x-1/2 h-3 w-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={12}
          height={12}
          viewBox="0 0 12 12"
        >
          <circle
            cx={6}
            cy={6}
            r={5}
            fill="white"
            stroke={
              middle < 0
                ? 'rgb(var(--green-500))'
                : middle === 0
                ? 'rgb(var(--grey-400))'
                : 'rgb(var(--red-500))'
            }
            strokeWidth={2}
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {middleBubble}
      {bubbleArrow}
      {lineAndLabels}
    </div>
  );
};
