import React, { useCallback } from "react";
import { SavedSearch, SearchDetails } from "../../models/searchDetails";
import { Spacer } from "../Spacer";
import { parseISO } from "date-fns";
import { differenceInCalendarDays } from "date-fns/esm";
import styled from "@emotion/styled";
import { FillButton, FlexBox } from "@codecademy/gamut";

export type SaveFormProps = {
  details: SavedSearch;
  setDetails: (s: SavedSearch) => void;
};
export const SaveForm: React.FC<SaveFormProps> = ({ details, setDetails }) => {
  const setName = useCallback(
    (name: string) => {
      setDetails({ ...details, name });
    },
    [details]
  );

  const setRelDates = useCallback(
    (useRel: boolean) => {
      let relStartDate: number | undefined;
      let relEndDate: number | undefined;
      if (useRel) {
        const today = new Date();
        const start = details.startDate ? parseISO(details.startDate) : null;
        const end = details.endDate ? parseISO(details.endDate) : null;

        relStartDate = start
          ? differenceInCalendarDays(start, today)
          : undefined;
          
        relEndDate = end ? differenceInCalendarDays(end, today) : undefined;
      } else {
        relStartDate = undefined;
        relEndDate = undefined;
      }
      setDetails({ ...details, relEndDate, relStartDate });
    },
    [details]
  );

  return (
    <form>
      <label>
        What name do you want to give this search?
        <StyledInput
          placeholder="My Saved Search"
          value={details?.name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <Spacer />
      {details?.startDate || details?.endDate ? (
        <>
          <label>
            Do you want to use absolute or relative dates?
            <input
              type="radio"
              radioGroup="date_type"
              checked={!!(!details?.relEndDate && !details?.relStartDate)}
              onChange={() => setRelDates(false)}
            />
            &nbsp;Absolute &nbsp;&nbsp;
            <input
              type="radio"
              radioGroup="date_type"
              checked={!!(details?.relEndDate || details?.relStartDate)}
              onChange={() => setRelDates(true)}
            />
            &nbsp;Relative
          </label>
          <Spacer />
          <FlexBox>
            {details.relStartDate || details.startDate ? (
              <div>
                Start:{" "}
                <b>
                  {details.relStartDate
                    ? `${Math.abs(details.relStartDate)} day(s) ${
                        details.relStartDate < 0 ? "ago" : "from now"
                      }`
                    : details.startDate}
                </b>
              </div>
            ) : null}
            <Spacer />
            {details.relStartDate || details.startDate ? (
              <div>
                End:{" "}
                <b>
                  {details.relEndDate
                    ? `${Math.abs(details.relEndDate)} day(s) ${
                        details.relEndDate < 0 ? "ago" : "from now"
                      }`
                    : details.endDate}
                </b>
              </div>
            ) : null}
          </FlexBox>
        </>
      ) : null}
    </form>
  );
};

const StyledInput = styled.input`
  width: 23rem;
`;
