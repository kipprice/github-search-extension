import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { SavedSearch, SearchDetails } from "../../models/searchDetails";
import { Container, CTAButton, FillButton } from "@codecademy/gamut";
import { fontBase } from "@codecademy/gamut-styles";
import { Spacer } from "../Spacer";
import { SaveForm } from "../SaveForm";

export type SearchFormProps = {
  data: SearchDetails;
  onSearch: (data: SearchDetails) => void;
  userSet: string[];
  storeLocally: (data: SearchDetails) => void;
  onSave: (data: SavedSearch) => void;
};

export const SearchForm: React.FC<SearchFormProps> = ({
  data,
  onSearch,
  userSet,
  storeLocally,
  onSave,
}) => {
  const [localData, setLocalData] = useState<SearchDetails>(
    {} as SearchDetails
  );
  const [saveDetails, setSaveDetails] = useState<
    Pick<SavedSearch, "name" | "relStartDate" | "relEndDate" | "autoload">
  >({ name: "", autoload: false });

  const [willSave, setWillSave] = useState<boolean>(false);

  useEffect(() => {
    setLocalData(data || ({} as SearchDetails));
  }, [data]);

  const setProp = useCallback(
    <K extends keyof SearchDetails>(propName: K, value: SearchDetails[K]) => {
      setLocalData({
        ...localData,
        [propName]: value,
      });
    },
    [localData]
  );

  return (
    <>
      <label>
        Github Usernames:
        <StyledInput
          list="username-hx"
          value={localData.usernames}
          onChange={(e) => setProp("usernames", e.target.value)}
          placeholder="e.g. userA,userB"
          onBlur={() => storeLocally(localData)}
        />
        <datalist id="username-hx">
          {userSet.map((us) => (
            <option value={us} />
          ))}
        </datalist>
      </label>

      <Spacer h={0.5} />
      <Container align="baseline">
        <StyledLabel>
          <input
            type="checkbox"
            checked={!!localData.asAuthor}
            onChange={() => setProp("asAuthor", !localData.asAuthor)}
            onBlur={() => storeLocally(localData)}
          />
          &nbsp;As author
        </StyledLabel>

        <Spacer h={0} />

        <StyledLabel>
          <input
            type="checkbox"
            checked={!!localData.asCommentor}
            onChange={() => setProp("asCommentor", !localData.asCommentor)}
            onBlur={() => storeLocally(localData)}
          />
          &nbsp;As commenter
        </StyledLabel>
      </Container>

      <Spacer />

      <label>
        Start Date:
        <StyledInput
          type="date"
          value={localData.startDate}
          onChange={(e) => setProp("startDate", e.target.value)}
          onBlur={() => storeLocally(localData)}
        />
      </label>
      <Spacer />

      <label>
        End Date:
        <StyledInput
          type="date"
          value={localData.endDate}
          onChange={(e) => setProp("endDate", e.target.value)}
          onBlur={() => storeLocally(localData)}
        />
      </label>
      <Spacer />

      <label>
        Organizations:
        <StyledInput
          value={localData.orgs}
          onChange={(e) => setProp("orgs", e.target.value)}
          placeholder="e.g. orgA,userB"
          onBlur={() => storeLocally(localData)}
        />
      </label>
      <Spacer />

      <label>
        Repos:
        <br />
        <StyledInput
          value={localData.repos}
          onChange={(e) => setProp("repos", e.target.value)}
          placeholder="e.g. orgA/repoA,userB/repoB"
          onBlur={() => storeLocally(localData)}
        />
      </label>
      <Spacer />

      <label>
        Branches:
        <StyledInput
          value={localData.branches}
          onChange={(e) => setProp("branches", e.target.value)}
          placeholder="e.g. main,develop"
          onBlur={() => storeLocally(localData)}
        />
      </label>

      <Spacer />
      <label>
        Freetext:
        <br />
        <StyledInput
          value={localData.freetext}
          onChange={(e) => setProp("freetext", e.target.value)}
          placeholder="exact text you want to be include in the search"
          onBlur={() => storeLocally(localData)}
        />
      </label>
      <Spacer />
      <Spacer />

      <label>
        <input
          type="checkbox"
          checked={willSave}
          onChange={() => setWillSave(!willSave)}
        />
        &nbsp;Save this search?
      </label>
      {willSave ? (
        <>
          <Spacer />
          <SaveForm
            details={{ ...localData, ...saveDetails }}
            setDetails={(s: SavedSearch) => {
              const { relStartDate, relEndDate, name } = s;
              setSaveDetails({
                autoload: false,
                name,
                relStartDate,
                relEndDate,
              });
            }}
          />
          <Spacer />
          <FillButton size='small' onClick={() => onSave({ ...localData, ...saveDetails })}>
            Save Search
          </FillButton>
        </>
      ) : null}
      <Spacer />
      <Spacer />

      <StyledCTAButton onClick={() => onSearch(localData)}>
        Search
      </StyledCTAButton>

      <Spacer />
      <div style={{ fontFamily: fontBase, textAlign: "center" }}>
        Any blank fields will be ignored in the query. Plural fields can accept
        a single value, or a list of comma-delimited values.
      </div>
      <Spacer />
    </>
  );
};

const StyledInput = styled.input`
  width: 23rem;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
`;

const StyledCTAButton = styled(CTAButton)`
  width: 100%;
  span {
    justify-content: center;
  }
`;
