import { AssetFilterOption } from "@storyteller/common";

interface Props {
  onClick: (button: AssetFilterOption) => void;
  value: AssetFilterOption;
}

const FILTERS = [
  {
    text: "추천",
    option: AssetFilterOption.FEATURED,
  },
  {
    text: "내 것",
    option: AssetFilterOption.MINE,
  },
  {
    text: "북마크",
    option: AssetFilterOption.BOOKMARKED,
  },
];

export function FilterButtons({ onClick, value }: Props) {
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto overflow-y-hidden px-4">
        {FILTERS.map((filter) => {
          const isBookmarks = filter.option === AssetFilterOption.BOOKMARKED;
          return (
            <button
              key={filter.option}
              className={`filter-tab${value === filter.option ? " active" : ""}`}
              disabled={isBookmarks}
              onClick={() => onClick(filter.option)}
            >
              {filter.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
