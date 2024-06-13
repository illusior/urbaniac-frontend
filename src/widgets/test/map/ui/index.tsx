import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { AvailableMapNameParam } from '~/shared/config';
import MariElMap from '~assets/maps/russia/mari-el.svg?react';
import RussiaMap from '~assets/maps/russia/russia.svg?react';
import WorldMap from '~assets/maps/world.svg?react';
import clamp from 'clamp';
import styles from './index.module.css';
import { useTimer } from 'react-timer-and-stopwatch';

interface TestMapProps {
  mapName: string;
}

const UNCHOSEN_FILL_COLOR = 'rgb(242, 242, 242)';
const FIND_ATTEMPT_TO_COLOR_MAP = new Map<number, string>([
  [0, 'rgb(239, 65, 53)'], // incorrect
  [1, 'rgb(249, 168, 37)'], // more bad
  [2, 'rgb(255, 187, 120)'], // warn
  [3, 'rgb(46, 204, 113)'], // correct
]);
const TRIES_TO_CHOOSE_CORRECT = FIND_ATTEMPT_TO_COLOR_MAP.size - 1;

interface Chooseable {
  codeIso: string;
}

const countNestedBy = (
  element: SVGSVGElement,
  predicate: (e: SVGSVGElement) => boolean,
): number => {
  function countNestedRecursive(el: SVGSVGElement) {
    let count = 0;

    if (predicate(el)) {
      count++;
    }

    for (const child of el.children) {
      count += countNestedRecursive(child as SVGSVGElement);
    }

    return count;
  }

  return countNestedRecursive(element);
};

const collectNestedBy = (
  element: SVGSVGElement,
  predicate: (e: SVGSVGElement) => boolean,
): SVGSVGElement[] => {
  function countNestedRecursive(el: SVGSVGElement): SVGSVGElement[] {
    const result: SVGSVGElement[] = [];

    if (predicate(el)) {
      result.push(el);
    }

    for (const child of el.children) {
      const rest = countNestedRecursive(child as SVGSVGElement);
      result.push(...rest);
    }

    return result;
  }

  return countNestedRecursive(element);
};

const DATA_CHOOSEABLE_ATTRIBUTE_KEY = 'data-chooseable';

const isAvaliableToChoose = (el: SVGSVGElement) => el.hasAttribute(DATA_CHOOSEABLE_ATTRIBUTE_KEY);
const isAlreadyGuessed = (el: SVGSVGElement) => el.style.fill !== UNCHOSEN_FILL_COLOR;
const isLeftToChoose = (el: SVGSVGElement) => isAvaliableToChoose(el) && !isAlreadyGuessed(el);

type IsoStringT = string;
type IsoStringToNameMap = Map<IsoStringT, string>;

const MAP_ISO_CODE_TO_RUSSIA_FEDERATIVE_STATE_NAME: IsoStringToNameMap = new Map([
  // 000 sorted by ISO 3166-2 code asc
  ['RU-AD', 'Республика Адыгея'],
  ['RU-AL', 'Республика Алтай'],
  ['RU-BA', 'Республика Башкортастан'],
  ['RU-BU', 'Республика Бурятия'],
  ['RU-DA', 'Республика Дагестан'],
  // 005
  ['RU-DN', 'Донецкая Народная Республика'],
  ['RU-IN', 'Республика Ингушетия'],
  ['RU-KB', 'Кабардино-Балкарская Республика'],
  ['RU-KL', 'Республика Калмыкия'],
  ['RU-KC', 'Карачаево-Черкесская Республика'],
  // 010
  ['RU-KR', 'Республика Карелия'],
  ['RU-KO', 'Республика Коми'],
  ['RU-CRI', 'Республика Крым'],
  ['RU-LN', 'Луганская Народная Республика'],
  ['RU-ME', 'Республика Марий Эл'],
  // 015
  ['RU-MO', 'Республика Мордовия'],
  ['RU-SA', 'Республика Саха (Якутия)'],
  ['RU-SE', 'Республика Северная Осетия - Алания'],
  ['RU-TA', 'Луганская Татарстан'],
  ['RU-TY', 'Республика Тыва'],
  // 020
  ['RU-UD', 'Удмуртская Республика'],
  ['RU-KK', 'Республика Хакасия'],
  ['RU-CE', 'Чеченская Республика'],
  ['RU-CU', 'Чувашская Республика - Чувашия'],
  ['RU-ALT', 'Алтайский край'],
  // 025
  ['RU-ZAB', 'Забайкальский край'],
  ['RU-KAM', 'Камчатский край'],
  ['RU-KDA', 'Краснодарский край'],
  ['RU-KYA', 'Красноярский край'],
  ['RU-PER', 'Пермский край'],
  // 030
  ['RU-PRI', 'Приморский край'],
  ['RU-STA', 'Ставропольский край'],
  ['RU-KHA', 'Хабаровский край'],
  ['RU-AMU', 'Амурская область'],
  ['RU-ARK', 'Архангельская область'],
  // 035
  ['RU-AST', 'Астраханская область'],
  ['RU-BEL', 'Белгородская область'],
  ['RU-BRY', 'Брянская область'],
  ['RU-VLA', 'Владимирская область'],
  ['RU-VGG', 'Волгоградская область'],
  // 040
  ['RU-VLG', 'Вологодская область'],
  ['RU-VOR', 'Воронежская область'],
  ['RU-ZP', 'Запорожская область'],
  ['RU-IVA', 'Ивановская область'],
  ['RU-IRK', 'Иркутская область'],
  // 045
  ['RU-KGD', 'Калининградская область'],
  ['RU-KLU', 'Калужская область'],
  ['RU-KEM', 'Кемеровская область — Кузбасс'],
  ['RU-KIR', 'Кировская область'],
  ['RU-KOS', 'Костромская область'],
  // 050
  ['RU-KGN', 'Курганская область'],
  ['RU-KRS', 'Курская область'],
  ['RU-LEN', 'Ленинградская область'],
  ['RU-LIP', 'Липецкая область'],
  ['RU-MAG', 'Магаданская область'],
  // 055
  ['RU-MOS', 'Московская область'],
  ['RU-MUR', 'Мурманская область'],
  ['RU-NIZ', 'Нижегородская область'],
  ['RU-NGR', 'Новгородская область'],
  ['RU-NVS', 'Новосибирская область'],
  // 060
  ['RU-OMS', 'Омская область'],
  ['RU-ORE', 'Оренбургская область'],
  ['RU-ORL', 'Орловская область'],
  ['RU-PNZ', 'Пензенская область'],
  ['RU-PSK', 'Псковская область'],
  // 065
  ['RU-ROS', 'Ростовская область'],
  ['RU-RYA', 'Рязанская область'],
  ['RU-SAM', 'Самарская область'],
  ['RU-SAR', 'Саратовская область'],
  ['RU-SAK', 'Сахалинская область'],
  // 070
  ['RU-SVE', 'Свердловская область'],
  ['RU-SMO', 'Смоленская область'],
  ['RU-TAM', 'Тамбовская область'],
  ['RU-TVE', 'Тверская область'],
  ['RU-TOM', 'Томская область'],
  // 075
  ['RU-TUL', 'Тульская область'],
  ['RU-TYU', 'Тюменская область'],
  ['RU-ULY', 'Ульяновская область'],
  ['RU-KH', 'Херсонская область'],
  ['RU-CHE', 'Челябинская область'],
  // 080
  ['RU-YAR', 'Ярославская область'],
  ['RU-MOW', 'Москва'],
  ['RU-SPE', 'Санкт-Петербург'],
  ['RU-SEV', 'Севастополь'],
  ['RU-YEV', 'Еврейская автономная область'],
  // 085
  ['RU-NEN', 'Ненецкий автономный округ'],
  ['RU-KHM', 'Ханты-Мансийский автономный округ — Югра'],
  ['RU-CHU', 'Чукотский автономный округ'],
  ['RU-YAN', 'Ямало-Ненецкий автономный округ'],
  // 089
]);

const MAP_ISO_CODE_TO_RUSSIA_MARI_EL_STATE_NAME: IsoStringToNameMap = new Map([
  // 000 sorted by ISO 3166-2 code asc
  ['RU-ME-VZH', 'Волжский район'],
  ['RU-ME-GRN', 'Горномарийский район'],
  ['RU-ME-ZVG', 'Звениговский район'],
  ['RU-ME-KLM', 'Килемарский район'],
  ['RU-ME-KZH', 'Куженерский район'],
  // 005
  ['RU-ME-MT', 'Мари-Турекский район'],
  ['RU-ME-MD', 'Медведевский район'],
  ['RU-ME-MK', 'Моркинский район'],
  ['RU-ME-NVT', 'Новоторъяльский район'],
  ['RU-ME-ORS', 'Оршанский район'],
  // 010
  ['RU-ME-PAR', 'Параньгинский район'],
  ['RU-ME-SER', 'Сернурский район'],
  ['RU-ME-SVT', 'Советский район'],
  ['RU-ME-YUR', 'Юринский район'],
  ['RU-ME-YOS', 'Йошкар-Ола'],
  // 015
  ['RU-ME-VSK', 'Волжск'],
  ['RU-ME-KZM', 'Козьмодемьянск'],
  // 017
]);

type TestMapHtmlElement = React.SVGProps<SVGSVGElement>;
type TestMapReactElement = React.FC<TestMapHtmlElement>;

interface TestMap {
  mapComponent: TestMapReactElement;
  isoCodesToString: IsoStringToNameMap;
}

const MAP_NAME_TO_MAP = new Map<AvailableMapNameParam, TestMap>([
  // russia
  [AvailableMapNameParam.RUSSIA, {
    isoCodesToString: MAP_ISO_CODE_TO_RUSSIA_FEDERATIVE_STATE_NAME,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mapComponent: RussiaMap,
  }],
  [AvailableMapNameParam.MARI_EL, {
    isoCodesToString: MAP_ISO_CODE_TO_RUSSIA_MARI_EL_STATE_NAME,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mapComponent: MariElMap,
  }],

  // world
  [AvailableMapNameParam.WORLD, {
    isoCodesToString: MAP_ISO_CODE_TO_RUSSIA_MARI_EL_STATE_NAME,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mapComponent: WorldMap,
  }],
]);

export const TestMap: React.FC<TestMapProps> = ({ mapName }: TestMapProps): JSX.Element => {
  const MapInfo = MAP_NAME_TO_MAP.get(mapName as AvailableMapNameParam);

  if (!MapInfo) {
    return <></>;
  }

  const MapComponent = MapInfo.mapComponent;
  const isoCodesToString = MapInfo.isoCodesToString;

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getMap = () => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) {
      return;
    }
    return mapContainer.querySelector<SVGSVGElement>('#map');
  };

  const [leftToGuess, setLeftToGuess] = useState<number>(isoCodesToString.size);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const scorePercentageStep = 100 / isoCodesToString.size;

  const countLeftToGuess = () => {
    const map = getMap();
    if (map) {
      const counted = countNestedBy(map, isLeftToChoose);
      setLeftToGuess(counted);
    }
  };

  const timer = useTimer({
    create: { stopwatch: {} },
    includeMilliseconds: true,
    intervalRate: 1,
  });
  useEffect(() => {
    if (leftToGuess === 0) {
      timer.pauseTimer();
    }
  }, [timer]);

  const [leftToGuessInfo, setTotalToGuess] = useState<Chooseable[]>([]);
  useEffect(() => {
    const map = getMap();
    if (map) {
      const svgElements = collectNestedBy(map, isLeftToChoose);
      setTotalToGuess(svgElements.map((el) => {
        return { codeIso: el.dataset.codeIso ?? '' };
      }));
    }
  }, [leftToGuess]);

  const [toFind, setToFind] = useState<Chooseable>();
  useLayoutEffect(() => {
    setToFind(leftToGuessInfo[Math.floor(Math.random() * leftToGuessInfo.length)]);
  }, [leftToGuessInfo]);

  const [findAttempt, setFindAttempt] = useState<number>(TRIES_TO_CHOOSE_CORRECT);

  return (
    <div className={styles['map-widget-wrapper']}>
      <div
        className={styles['map-wrapper']}
        ref={mapContainerRef}
      >
        <MapComponent
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async (e: React.MouseEvent<SVGSVGElement>) => {
            const chosenSvg = e.target as SVGSVGElement;
            const isNeedToColor = isAvaliableToChoose(chosenSvg) && !isAlreadyGuessed(chosenSvg);
            if (!isNeedToColor) {
              return;
            }

            const isCorrectChoose = chosenSvg.dataset.codeIso === toFind?.codeIso;
            const hasFindAttempts = findAttempt >= 0;
            const mustColorErrorOrCorrectChoose = isCorrectChoose || !hasFindAttempts;
            if (!mustColorErrorOrCorrectChoose) {
              setFindAttempt(curr => curr - 1);
              await new Audio('/sounds/mouse-click-negative.wav').play();
              return;
            }

            if (hasFindAttempts) {
              await new Audio('/sounds/mouse-click.wav').play();
            }
            else {
              await new Audio('/sounds/error.wav').play();
            }

            const toColorSvg = (hasFindAttempts)
              ? chosenSvg
              : collectNestedBy(getMap()!, el => isLeftToChoose(el) && el.dataset.codeIso === toFind?.codeIso)[0];
            const fillColor = FIND_ATTEMPT_TO_COLOR_MAP.get(clamp(findAttempt, 0, TRIES_TO_CHOOSE_CORRECT)) ?? '';
            toColorSvg.style.fill = fillColor;

            if (hasFindAttempts) {
              setScorePercentage(curr => curr + 1 / (TRIES_TO_CHOOSE_CORRECT - findAttempt + 1) * scorePercentageStep);
            }
            setFindAttempt(TRIES_TO_CHOOSE_CORRECT);

            countLeftToGuess();
          }}
          className={styles.map}
        />
      </div>
      <div className={styles['test-info-wrapper']}>
        <div className={styles.timer}>
          {timer.timerText}
        </div>
        <div className={styles['test-info']}>
          {
            (toFind) && (
              <>
                Найди на карте:
                {' '}
                {isoCodesToString.get(toFind.codeIso)}
              </>
            )
          }
        </div>
        <div className={styles['succeed-percentage']}>
          Процент знания:
          {' '}
          {scorePercentage.toFixed(2)}
          %
        </div>
      </div>
    </div>
  );
};
