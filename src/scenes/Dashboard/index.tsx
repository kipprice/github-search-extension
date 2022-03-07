import React, { useCallback, useEffect, useState } from "react";
import { FlexBox, IconButton, Text, TextButton } from "@codecademy/gamut";
import { TrashIcon, EditIcon } from '@codecademy/gamut-icons'
import { SavedSearch, SearchDetails } from "../../models/searchDetails";
import styled from "@emotion/styled";
import { addDays } from "date-fns/esm";
import { format } from "date-fns";

export type DashboardProps = {
    searches: SavedSearch[];
    onSearch: (s: SearchDetails) => void;
    onEdit: (s: SearchDetails) => void;
    onDelete: (s: SavedSearch) => void;
}
export const Dashboard: React.FC<DashboardProps> = ({ searches, onSearch, onEdit, onDelete }) => {

    const onSearchSelected = useCallback((s: SavedSearch, action: 'search' | 'edit') => {
        const dtFmt = 'yyyy-MM-dd';

        if (s.relStartDate || s.relEndDate) {
            const today = new Date();
            s.startDate = s.relStartDate ? format(addDays(today, s.relStartDate), dtFmt) : s.startDate;
            s.endDate = s.relEndDate ? format(addDays(today, s.relEndDate), dtFmt) : s.endDate;
        }

        if (action === 'search') {
            onSearch(s)
        } else {
            onEdit(s)
        }

    }, [])

  return (
    <FlexBox flexDirection='column' width='100%'>
        {searches.length === 0 ? <SubtleText>No saved searches</SubtleText> : null}
      {searches.map((s) => (
        <SFlex>
            <SNameButton onClick={() => onSearchSelected(s, 'search')}>{s.name}</SNameButton>
            <SIconButton onClick={() => onSearchSelected(s, 'edit')} icon={EditIcon} />
            <SIconButton onClick={() => onDelete(s)} icon={TrashIcon} />
        </SFlex>
      ))}
    </FlexBox>
  );
};

const SFlex = styled(FlexBox)`
    width: 100%;
`

const SNameButton = styled(TextButton)`
    flex-grow: 1;
`

const SIconButton = styled(IconButton)`
    span {
        color: gray !important;
    }
`
const SubtleText = styled.span`
    color: #555;
`;