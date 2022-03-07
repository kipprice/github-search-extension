export interface SearchDetails {
    usernames: string;
    asAuthor: boolean;
    asCommentor: boolean;
    startDate: string;
    endDate: string;
    orgs: string;
    branches: string;
    repos: string;
    freetext: string;
}

export interface SavedSearch extends SearchDetails {
    name: string;
    autoload: boolean;
    relStartDate?: number;
    relEndDate?: number;
}