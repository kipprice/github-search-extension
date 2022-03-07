import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { fontAccent } from "@codecademy/gamut-styles";
import { SearchForm } from "./components";
import { SavedSearch, SearchDetails } from "./models/searchDetails";
import { retrieveLocally, retrieveMode, retrieveSearches, saveMode, saveSearches, storeLocally } from "./helpers/localStorage";
import { search } from "./helpers/search";
import { Dashboard } from "./scenes/Dashboard";
import {
  AccordionArea,
  AccordionButton,
} from "@codecademy/gamut";

export const App: React.FC = () => {
  const [usernameHx, setUsernameHx] = useState("");
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [localData, setLocalData] = useState<SearchDetails>(
    {} as SearchDetails
  );
  const [mode, setMode] = useState("");

  // ==> retrieve the last search from local storage
  useEffect(() => {
    retrieveLocally(
      (d: SearchDetails) => setLocalData((curData) => ({ ...curData, ...d })),
      setUsernameHx
    );
    retrieveSearches(
      setSearches
    )
    retrieveMode(
      setMode
    )
  }, []);

  // ==> actually generate the search URL
  const onSearch = useCallback((searchData: SearchDetails) => {
    search(searchData);
    setLocalData(searchData);
  }, []);

  const onSave = useCallback((data: SavedSearch) => {

    const updatedSearches = [...searches, { ...data }]
    setSearches(updatedSearches)
    saveSearches(updatedSearches, () => setMode('dashboard'))
  }, [searches])

  const changeMode = useCallback((m: string) => {
    setMode(m)
    saveMode(m)
  }, [])

  const userSet = [...new Set(usernameHx.split(","))];

  return (
    <StyledContainer>

      {/* SEARCH FORM */}
      <AccordionArea
        expanded={mode === "search"}
        top={
          <SAccordionButton
            onClick={() =>
              mode === "search" ? changeMode("") : changeMode("search")
            }
            expanded={mode === "search"}
          >
            Search
          </SAccordionButton>
        }
      >
        <SearchForm
          userSet={userSet}
          onSearch={onSearch}
          data={localData}
          storeLocally={(d) => storeLocally(d, usernameHx)}
          onSave={onSave}
        />
      </AccordionArea>

      {/* SAVED SEARCHES */}
      <AccordionArea
        expanded={mode === "dashboard"}
        top={
          <SAccordionButton
            onClick={() =>
              mode === "dashboard" ? changeMode("") : changeMode("dashboard")
            }
            expanded={mode === "dashboard"}
          >
            Saved Searches
          </SAccordionButton>
        }
      >
        <Dashboard 
          searches={searches} 
          onSearch={onSearch} 
          onEdit={(s: SearchDetails) => {
            setLocalData(s);
            setMode('search')
          }} 
          onDelete={(search: SavedSearch) => {
            const out = searches.slice();
            for (let sIdx = 0; sIdx < searches.length; sIdx += 1) {
              const s = searches[sIdx];
              if (s.name === search.name) {
                out.splice(sIdx, 1)
              }
            }
            setSearches(out)
            saveSearches(out)
          }}
        />
      </AccordionArea>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  font-family: ${fontAccent};
  padding: 1rem;
  min-width: 25rem;
`;

const SAccordionButton = styled(AccordionButton)`
  padding: 0;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;
