export const createBanner = ({ name, version, author, license }) =>
  `/*\n` +
  ` * ${name} v${version} \n` +
  ` * \n` +
  ` * Copyright (C) ${author}.\n` +
  ` * This source code is licensed under the ${license} license.\n` +
  ' */'
