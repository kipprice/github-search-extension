declare var chrome: any;
import { SavedSearch, SearchDetails } from "../models/searchDetails";

export const retrieveLocally = (setData: (data: SearchDetails) => void, setUsernameHx: (hx: string) => void) => {
  chrome.storage.local.get(
    [
      "usernames",
      "usernameHx",
      "startDate",
      "endDate",
      "orgs",
      "branches",
      "asAuthor",
      "asCommenter",
      "repos",
      "freetext",
    ],
    ({ usernameHx, ...data }: any) => {
      setData(data)

      if (usernameHx) {
        setUsernameHx(usernameHx);
      }

    })
}

  // ==> update the last search in local storage
export const storeLocally = (data: SearchDetails, usernameHx: string) => {
    chrome.storage.local.set(
      {
        ...data,
        usernameHx: `${usernameHx ? `${usernameHx},` : ""}${data.usernames}`,
      },
      () => null
    );
}

export const retrieveSearches = (setSearches: (s: SavedSearch[]) => void) => {
  chrome.storage.local.get(
    [
      "searches"
    ],
    ({ searches }: any) => {
      if (!searches) { setSearches([]); return  }

      setSearches(JSON.parse(searches))
    }
  );
}

export const saveSearches = (searches: SavedSearch[], cb?: () => void) => {
  chrome.storage.local.set(
    {
      searches: JSON.stringify(searches)
    },
    () => cb ? cb() : null
  );
}

export const retrieveMode = (setMode: (m: string) => void) => {
  chrome.storage.local.get(
    [
      "mode"
    ],
    ({ mode }: any) => {
      setMode(mode)
    }
  );
}

export const saveMode = (mode: string, cb?: () => void) => {
  chrome.storage.local.set(
    {
      mode
    },
    () => cb ? cb() : null
  );
}