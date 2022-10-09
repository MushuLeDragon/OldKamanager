import {useQuery, useQueryClient} from "react-query";
import {getFromServer} from "../../../services/server";
import {Header, StyledGears, ColumnHeader} from "./styles";
import Gear from "../../molecules/Gear/Gear";
import {Gear as GearType} from "../../../types/Gear";
import Filters from "../../molecules/Filters/Filters"
import {Filters as FiltersType} from "./types"
import {useContext, useState} from "react";
import {FilterContext} from "../../../contexts/FilterContext";

const initialFilters: FiltersType = {
  craft: "off"
}

type CraftsQuery = {
  gears: GearType[],
  remaining: number,
}

export default function Gears() {
  const [frontFilters, setFrontFilters] = useState(initialFilters as FiltersType);
  const queryClient = useQueryClient();
  const { filters  } = useContext(FilterContext);
  const types = filters.types?.toString();

  const {data, isLoading} = useQuery<CraftsQuery>(['gears', {
    ...filters,
    types,
  }], fetchGears)

  const gears = data?.gears || [];
  const remaining = data?.remaining || 0

  return (
    <div>
      <Filters isGearsPage={true}/>
      <p>({remaining} Restants)</p>
      <StyledGears>
        <Header>
          <span>Image</span>
          <span>Nom</span>
          <span>Niveau</span>
          <span>Vendus</span>
          <span>En vente</span>
          <span>Possédé</span>
          <span>Racheter</span>
          <span>Wish List</span>
          <span>Prix</span>
          <ColumnHeader onClick={() => toggleFilter('craft')}>
            Craft
            {frontFilters.craft === 'asc' ? ' ^' : frontFilters.craft === 'desc' ? ' v' : ''}
          </ColumnHeader>
          <span>Ratio</span>
          <span>Recette</span>
        </Header>
        {isLoading ? <p>ça charge les cocos</p> :
          sortedGears().map((gear) => (
              <Gear key={gear._id + gear.currentPrice} data={gear} afterUpdate={refetch}/>
            )
          )
        }
      </StyledGears>
    </div>
  )

  function toggleFilter(filter: keyof typeof frontFilters) {

    const currentValue = frontFilters[filter];

    setFrontFilters({
      [filter]: newFilterValue(filter, currentValue)
    })
  }

  function newFilterValue(filter: keyof typeof frontFilters, value: 'off' | 'asc' | 'desc') {
    switch (value) {
      case "off":
        return 'asc';
      case 'asc':
        return 'desc';
      case 'desc':
      default:
        return 'off';
    }
  }

  /**
   * Sort by benefit and wanted status
   *
   * Priority :
   * toBeCrafted > Wished > Benefit
   *
   * < 0 => A->B
   * > 0 => B-> A
   */
  function sortedGears() {
    return gears.sort((gear1, gear2) => {

      if (frontFilters.craft === 'asc') {
        return gear2.craftingPrice - gear1.craftingPrice;
      }

      if (frontFilters.craft === 'desc') {
        return gear1.craftingPrice - gear2.craftingPrice;
      }

      return 1;
    })
  }

  function refetch() {
    queryClient.invalidateQueries('gears');
  }

  function fetchGears({queryKey}: any) {
    const [key, params] = queryKey;
    const search = encodeURIComponent(params.search);
    return getFromServer('/gears', {
      ...params,
      search,
    })
      .then(response => response.data)
  }
}