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

  renderEnds: (n: number) => ReactNode;
  renderMiddle: (n: number) => ReactNode;
}> = ({ left, middle, right, renderEnds, renderMiddle }) => {
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

  const line = (
    <div className="flex mt-1 relative h-3">
      <div
        className={clsx(
          'h-1 w-1/2 my-auto rounded-sm',
          left <= 0 ? 'bg-green-500' : 'bg-red-500',
        )}
      ></div>
      <div
        className={clsx(
          'h-1 w-1/2 my-auto rounded-sm',
          right <= 0 ? 'bg-green-500' : 'bg-red-500',
        )}
      ></div>
      <div className="absolute left-1/2 -translate-x-1/2 h-3 w-3">
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
              middle <= 0 ? 'rgb(var(--green-500))' : 'rgb(var(--red-500))'
            }
            strokeWidth={2}
          />
        </svg>
      </div>
    </div>
  );

  const endNumbers = (
    <div className="flex justify-between text-xsm font-medium leading-tight text-grey-400">
      <span>
        <Triangle up={left > 0} />
        {renderEnds(left)}
      </span>
      <span>
        <Triangle up={right > 0} />
        {renderEnds(right)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col">
      {middleBubble}
      {bubbleArrow}
      {line}
      {endNumbers}
    </div>
  );
};
