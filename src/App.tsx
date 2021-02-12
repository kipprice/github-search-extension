import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { CTAButton } from "@codecademy/gamut";
import { fontAccent } from "@codecademy/gamut-styles";

declare var chrome: any;

export const App: React.FC = () => {
  const [usernames, setUsernames] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orgs, setOrgs] = useState("");
  const [branches, setBranches] = useState("");

  useEffect(() => {
    chrome.storage.local.get(
      ["usernames", "startDate", "endDate", "orgs", "branches"],
      (result: any) => {
        if (result.usernames) {
          setUsernames(result.usernames);
        }
        if (result.startDate) {
          setStartDate(result.startDate);
        }
        if (result.endDate) {
          setEndDate(result.endDate);
        }
        if (result.orgs) {
          setOrgs(result.orgs);
        }
        if (result.branches) {
          setBranches(result.branches);
        }
      }
    );
  }, []);

  const storeLocally = useCallback(() => {
    chrome.storage.local.set(
      {
        usernames,
        startDate,
        endDate,
        orgs,
        branches,
      },
      () => null
    );
  }, [usernames, startDate, endDate, orgs, branches]);

  const search = useCallback(() => {
    const queryPieces = [];
    const splitOrgs = orgs.split(",");
    for (let o of splitOrgs) {
      if (!o) {
        continue;
      }
      queryPieces.push(encodeURIComponent(`org:${o}`));
    }

    const splitBranches = branches.split(",");
    for (let b of splitBranches) {
      if (!b) {
        continue;
      }
      queryPieces.push(encodeURIComponent(`base:${b}`));
    }

    const splitUsernames = usernames.split(",");
    for (let u of splitUsernames) {
      if (!u) {
        continue;
      }
      queryPieces.push(encodeURIComponent(`author:${u}`));
    }

    if (startDate && endDate) {
      if (startDate === endDate) {
        queryPieces.push(encodeURIComponent(`merged:${startDate}`));
      } else {
        queryPieces.push(encodeURIComponent(`merged:${startDate}..${endDate}`));
      }
    } else if (startDate) {
      queryPieces.push(encodeURIComponent(`merged:>${startDate}`));
    } else if (endDate) {
      queryPieces.push(encodeURIComponent(`merged:<${endDate}`));
    }

    queryPieces.push("is:pr");

    window.open(`https://github.com/search?q=${queryPieces.join("+")}`);
  }, [usernames, startDate, endDate, orgs, branches]);

  return (
    <StyledContainer>
      <label>
        Username:
        <StyledInput
          value={usernames}
          onChange={(e) => setUsernames(e.target.value)}
          onBlur={storeLocally}
        />
      </label>
      <Spacer />

      <label>
        Start Date:
        <StyledInput
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={storeLocally}
        />
      </label>
      <Spacer />

      <label>
        End Date:
        <StyledInput
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={storeLocally}
        />
      </label>
      <Spacer />

      <label>
        Organizations:
        <StyledInput
          value={orgs}
          onChange={(e) => setOrgs(e.target.value)}
          onBlur={storeLocally}
        />
      </label>
      <Spacer />

      <label>
        Branches:
        <StyledInput
          value={branches}
          onChange={(e) => setBranches(e.target.value)}
          onBlur={storeLocally}
        />
      </label>
      <Spacer />
      <Spacer />

      <CTAButton onClick={search}>Search</CTAButton>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  font-family: ${fontAccent};
  padding: 1rem;
`;

const StyledInput = styled.input`
  width: 20rem;
`;

const Spacer = styled.div`
  width: 16px;
  height: 16px;
`;
