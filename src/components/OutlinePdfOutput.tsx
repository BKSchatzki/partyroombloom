import React from 'react';

import { createTw } from 'react-pdf-tailwind';

import { Outline } from '@/lib/types';
import {
  Document,
  Page,
  Text,
  View,
} from '@react-pdf/renderer';

const tw = createTw({});

interface OutputProps {
  outline: Outline;
}

const OutlinePdfOutputComponent: React.FC<OutputProps> = ({ outline }) => {
  return (
    <Document>
      <Page
        size="LETTER"
        style={tw(`p-12 text-sm`)}
      >
        <View>
          {outline.title && (
            <Text
              style={tw(
                `border-b border-emerald-800 pb-2 text-xl font-bold leading-4 text-emerald-800`
              )}
            >
              {outline.title}
            </Text>
          )}
          <View style={tw(`border-b border-neutral-300 py-2 flex flex-col gap-2`)}>
            {outline.description && (
              <Text>
                <Text style={tw(`font-bold text-emerald-800`)}>Description: </Text>
                {outline.description}
              </Text>
            )}
            {outline.goal && (
              <Text>
                <Text style={tw(`font-bold text-emerald-800`)}>Goal: </Text>
                {outline.goal}
              </Text>
            )}
            {outline.comments && (
              <Text>
                <Text style={tw(`font-bold text-emerald-800`)}>Comments: </Text>
                {outline.comments}
              </Text>
            )}
          </View>
        </View>
        <View style={tw(`flex flex-col gap-1`)}>
          {outline.elements
            .filter((element) => element.type === 'landmark')
            .map((landmark) => (
              <View
                key={landmark.id}
                wrap={false}
                style={tw(`border-b border-neutral-300 pb-2`)}
              >
                <Text style={tw(`py-2`)}>
                  <Text style={tw(`text-lg font-bold leading-4 text-lime-800`)}>
                    {landmark.name}
                  </Text>
                  {landmark.name && landmark.description && ': '}
                  {landmark.description}
                </Text>
                <View style={tw(`flex flex-col gap-1 pl-4`)}>
                  {outline.elements
                    .filter(
                      (element) =>
                        element.parentId === landmark.id && element.type === 'interactable'
                    )
                    .map((interactable) => (
                      <React.Fragment key={interactable.id}>
                        <Text style={tw(`py-1 text-neutral-900`)}>
                          <Text style={tw(`text-base font-bold leading-4 text-cyan-800`)}>
                            {interactable.name}
                          </Text>
                          {interactable.name && interactable.description && ': '}
                          {interactable.description}
                        </Text>
                        <View style={tw(`flex flex-col gap-1 pl-4`)}>
                          {outline.elements
                            .filter(
                              (element) =>
                                element.parentId === interactable.id && element.type === 'secret'
                            )
                            .map((secret) => (
                              <React.Fragment key={secret.id}>
                                <Text style={tw(`py-1 text-neutral-800`)}>
                                  <Text style={tw(`text-sm font-bold leading-4 text-red-800`)}>
                                    {secret.name}
                                  </Text>
                                  {secret.name && secret.description && ': '}
                                  {secret.description}
                                </Text>
                                <View
                                  style={tw(
                                    `flex flex-col gap-2 pb-1 pl-4 text-xs leading-4 text-neutral-700`
                                  )}
                                >
                                  <Text>
                                    <Text style={tw(`font-bold text-yellow-800`)}>Success: </Text>
                                    {secret.rollableSuccess}
                                  </Text>
                                  <Text>
                                    <Text style={tw(`font-bold text-yellow-800`)}>Failure: </Text>
                                    {secret.rollableFailure}
                                  </Text>
                                </View>
                              </React.Fragment>
                            ))}
                        </View>
                      </React.Fragment>
                    ))}
                </View>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
};
const OutlinePdfOutput = React.memo(OutlinePdfOutputComponent);
OutlinePdfOutput.displayName = 'OutlinePdfOutput';
export default OutlinePdfOutput;
