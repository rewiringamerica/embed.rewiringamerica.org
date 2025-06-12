import BatteryIcon from 'jsx:../../static/icons/battery.svg';
import ClothesDryerIcon from 'jsx:../../static/icons/clothes-dryer.svg';
import CookingIcon from 'jsx:../../static/icons/cooking.svg';
import ElectricalWiringIcon from 'jsx:../../static/icons/electrical-wiring.svg';
import EvIcon from 'jsx:../../static/icons/ev.svg';
import HvacIcon from 'jsx:../../static/icons/hvac.svg';
import LawnMowerIcon from 'jsx:../../static/icons/lawnmower.svg';
import SolarIcon from 'jsx:../../static/icons/solar.svg';
import WaterHeaterIcon from 'jsx:../../static/icons/water-heater.svg';
import WeatherizationIcon from 'jsx:../../static/icons/weatherization.svg';
import { Project } from './projects';

export const PROJECT_ICONS: { [p in Project]: () => React.ReactElement } = {
  clothes_dryer: () => <ClothesDryerIcon width="1em" />,
  hvac: () => <HvacIcon width="1em" />,
  ev: () => <EvIcon width="1em" />,
  solar: () => <SolarIcon width="1em" />,
  battery: () => <BatteryIcon width="1em" />,
  water_heater: () => <WaterHeaterIcon width="1em" />,
  cooking: () => <CookingIcon width="1em" />,
  wiring: () => <ElectricalWiringIcon width="1em" />,
  weatherization_and_efficiency: () => <WeatherizationIcon width="1em" />,
  lawn_care: () => <LawnMowerIcon width="1em" />,
};
