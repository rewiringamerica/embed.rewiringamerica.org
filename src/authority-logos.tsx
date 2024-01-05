import { msg } from '@lit/localize';
import { css } from 'lit';
import { APIResponse } from './api/calculator-types-v1';

export const authorityLogosStyles = css`
  .authority-logos {
    width: 100%;
    max-width: 1280px;

    background-color: white;
  }

  .authority-logos h2 {
    text-align: center;
    color: #111;
    font-size: 2rem;
    font-weight: 500;
    line-height: 125%;

    margin: 48px 24px 64px 24px;
  }

  /* Tighter margins for the header on small screens */
  @media only screen and (max-width: 640px) {
    .authority-logos h2 {
      font-size: 1.5rem;
      margin-top: 32px;
      margin-bottom: 48px;
    }
  }

  .authority-logos__container {
    display: flex;

    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 64px;

    margin-bottom: 80px;
  }
`;

type Props = { response: APIResponse };

/**
 * Displays the white area at the bottom of the calculator results with logos
 * of the authorities whose incentives are displayed.
 */
export const AuthorityLogos = ({ response }: Props) => {
  const authoritiesWithLogo = Object.values(response.authorities).filter(
    auth => !!auth.logo,
  );
  if (authoritiesWithLogo.length === 0) {
    return <></>;
  }

  const logos = authoritiesWithLogo.map(auth => (
    <img
      alt={auth.name}
      src={auth.logo!.src}
      width={auth.logo!.width}
      height={auth.logo!.height}
    />
  ));

  const title = msg('Incentive data brought to you by', {
    desc: 'followed by authority logos',
  });
  return (
    <div className="authority-logos">
      <h2>{title}</h2>
      <div className="authority-logos__container">{logos}</div>
    </div>
  );
};