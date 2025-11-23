import React from 'react';

export default function ServerIconInline() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 682.667 682.667" style="enable-background:new 0 0 512 512" xml:space="preserve">
  <g>
    <defs>
      <clipPath id="a" clipPathUnits="userSpaceOnUse"><path d="M0 512h512V0H0Z"/></clipPath>
    </defs>
    <g clip-path="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
      <path d="M0 0h-422c-16.568 0-30 13.432-30 30v60c0 16.568 13.432 30 30 30H0c16.568 0 30-13.432 30-30V30C30 13.432 16.568 0 0 0Z" transform="translate(467 377)" fill="none" stroke="#ff7b00" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(90 437)" fill="#ff7b00"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(150 437)" fill="#ff7b00"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(210 437)" fill="#ff7b00"/>
      <path d="M0 0h120" transform="translate(317 437)" fill="none" stroke="#ff7b00" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0 0h-422c-16.568 0-30 13.432-30 30v60c0 16.568 13.432 30 30 30H0c16.568 0 30-13.432 30-30V30C30 13.432 16.568 0 0 0Z" transform="translate(467 196)" fill="none" stroke="#ff7b00" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(90 256)" fill="#ff7b00"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(150 256)" fill="#ff7b00"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(210 256)" fill="#ff7b00"/>
      <path d="M0 0h120" transform="translate(317 256)" fill="none" stroke="#ff7b00" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0 0h-422c-16.568 0-30 13.432-30 30v60c0 16.568 13.432 30 30 30H0c16.568 0 30-13.432 30-30V30C30 13.432 16.568 0 0 0Z" transform="translate(467 15)" fill="none" stroke="#ff7b00" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(90 75)" fill="#ff7b00"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(150 75)" fill="#ff7b00"/>
      <path d="M0 0c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15C-6.716 15 0 8.284 0 0" transform="translate(210 75)" fill="#ff7b00"/>
      <path d="M0 0h120" transform="translate(317 75)" fill="none" stroke="#ff7b00" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>
`;

  return <span className="server-inline-icon" dangerouslySetInnerHTML={{ __html: svg }} />;
}
