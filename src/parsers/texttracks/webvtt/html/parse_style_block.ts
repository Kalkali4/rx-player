/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import createDefaultStyleElements from "./create_default_style_elements";

export interface IStyleElements {
  [className : string]: string;
}

/**
 *
 * Parse style element from WebVTT.
 * @param {Array.<string>} styleBlock
 * @param {Object} baseStyleElements
 * @return {Array.<Object>} classes
 */
export default function parseStyleBlocks(styleBlocks : string[][]) : {
  classes : IStyleElements;
  global : string;
} {
  const classes : IStyleElements = createDefaultStyleElements();
  let global = "";

  styleBlocks.forEach((styleBlock) => {
    let index = 1;

    if (styleBlock.length >= 2) {
      while (index < styleBlock.length) {
        if (styleBlock[index].match(/::cue {/)) {
          index++;
          while (
            styleBlock[index] &&
            (!(styleBlock[index].match(/}/) || styleBlock[index].length === 0))
          ) {
            global += styleBlock[index];
            index++;
          }
        } else {
          const classNames : string[] = [];
          let cueClassLine;
          while (
            styleBlock[index] &&
            (cueClassLine = styleBlock[index].match(/::cue\(\.?(.*?)\)(?:,| {)/))
          ) {
            classNames.push(cueClassLine[1]);
            index++;
          }
          let styleContent = "";
          while (
            styleBlock[index] &&
            (!(styleBlock[index].match(/}/) || styleBlock[index].length === 0))
          ) {
            styleContent += styleBlock[index];
            index++;
          }
          classNames.forEach((className) => {
            const styleElement = classes[className];
            if (!styleElement) {
              classes[className] = styleContent;
            } else {
              classes[className] += styleContent;
            }
          });
        }
        index++;
      }
    }
  });
  return { classes, global };
}
