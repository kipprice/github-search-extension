import styled from "@emotion/styled";

export const Spacer = styled.span<{ w?: number; h?: number }>`
  width: ${(p) => p.w || 1}rem;
  height: ${(p) => (p.h == undefined ? 1 : p.h)}rem;
  display: ${(p) => (p.h === 0 ? "inline-block" : "block")};
`;