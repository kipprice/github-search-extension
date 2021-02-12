import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Container, CTAButton } from "@codecademy/gamut";
import { fontAccent, fontBase } from "@codecademy/gamut-styles";

declare var chrome: any;

export const App: React.FC = () => {
  const [usernames, setUsernames] = useState("");
  const [roles, setRoles] = useState<{ author: boolean; commenter: boolean }>({
    author: true,
    commenter: false,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orgs, setOrgs] = useState("");
  const [branches, setBranches] = useState("");

  useEffect(() => {
    chrome.storage.local.get(
      [
        "usernames",
        "startDate",
        "endDate",
        "orgs",
        "branches",
        "asAuthor",
        "asCommenter",
      ],
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
        setRoles({
          author: result.asAuthor === undefined ? true : result.asAuthor,
          commenter:
            result.asCommenter === undefined ? false : result.asCommenter,
        });
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
        asAuthor: roles.author,
        asCommenter: roles.commenter,
      },
      () => null
    );
  }, [usernames, startDate, endDate, orgs, branches, roles]);

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
      if (roles.author) {
        queryPieces.push(encodeURIComponent(`author:${u}`));
      }
      if (roles.commenter) {
        queryPieces.push(encodeURIComponent(`commenter:${u}`));
      }
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
  }, [usernames, startDate, endDate, orgs, branches, roles]);

  return (
    <StyledContainer>
      <label>
        Github Usernames:
        <StyledInput
          value={usernames}
          onChange={(e) => setUsernames(e.target.value)}
          onBlur={storeLocally}
        />
      </label>

      <Spacer h={0.5} />
      <Container align="baseline">
        <StyledLabel>
          <input
            type="checkbox"
            checked={!!roles.author}
            onChange={(e) => setRoles({ ...roles, author: !roles.author })}
            onBlur={storeLocally}
          />
          &nbsp;As author
        </StyledLabel>

        <Spacer h={0} />

        <StyledLabel>
          <input
            type="checkbox"
            checked={!!roles.commenter}
            onChange={(e) =>
              setRoles({ ...roles, commenter: !roles.commenter })
            }
            onBlur={storeLocally}
          />
          &nbsp;As commenter
        </StyledLabel>
      </Container>

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
      <Spacer />
      <span style={{ fontFamily: fontBase }}>
        (All fields that accept multiples expect the lists to be
        comma-delimited)
      </span>
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

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
`;

const Spacer = styled.span<{ w?: number; h?: number }>`
  width: ${(p) => p.w || 1}rem;
  height: ${(p) => (p.h == undefined ? 1 : p.h)}rem;
  display: ${(p) => (p.h === 0 ? "inline-block" : "block")};
`;
