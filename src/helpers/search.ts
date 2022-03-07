import { SearchDetails } from "../models/searchDetails";

export const search = (data: SearchDetails) => {
    const queryPieces: string[] = [];

    // ==> add the easily splittable pieces
    addSplitQuery(data.orgs, 'org', queryPieces)
    addSplitQuery(data.branches, 'base', queryPieces)
    addSplitQuery(data.repos, 'repo', queryPieces)

    // ==> usernames need to be associated with a role
    if (data.asAuthor) {
        addSplitQuery(data.usernames, 'author', queryPieces)
    }
    if (data.asCommentor) {
        addSplitQuery(data.usernames, 'commenter', queryPieces)
    }

    // ==> free text
    if (data.freetext) { queryPieces.push(`"${data.freetext}"`) }

    // ==> dates are the trickiest
    const { startDate, endDate } = data;
    if (startDate && endDate) {
    // one day
      if (startDate === endDate) {
        queryPieces.push(encodeURIComponent(`merged:${startDate}`));
    // date range
      } else {
        queryPieces.push(encodeURIComponent(`merged:${startDate}..${endDate}`));
      }
    // just a start date
    } else if (startDate) {
      queryPieces.push(encodeURIComponent(`merged:>${startDate}`));
      // just an end date
    } else if (endDate) {
      queryPieces.push(encodeURIComponent(`merged:<${endDate}`));
    }

    // ==> only search for PRs
    queryPieces.push("is:pr");
    
    // open the appropriate window
    window.open(`https://github.com/search?q=${queryPieces.join("+")}`);
}

const addSplitQuery = (value: string, prefix: string, queryPieces: string[]) => {
    const splitValue = value.split(',')
    for (let v of splitValue) {
        if (!v) { continue }
        queryPieces.push(encodeURIComponent(`${prefix}:${v}`))
    }
}