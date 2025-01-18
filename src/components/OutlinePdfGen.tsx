import React from 'react';

import dayjs from 'dayjs';
import { createTw } from 'react-pdf-tailwind';

import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Document,
  Page,
  PDFDownloadLink,
  Text,
  View,
} from '@react-pdf/renderer';

const tw = createTw({});

interface OutputProps {
  outline: Outline;
}

interface OutlinePdfGenProps extends OutputProps {
  className?: string;
  children: React.ReactNode;
}

const Output: React.FC<OutputProps> = ({ outline }) => {
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
                `text-xl font-bold text-emerald-800 leading-4 pb-2 border-b border-emerald-800`
              )}
            >
              {outline.title}
            </Text>
          )}
          <View style={tw(`py-2`)}>
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
        <View style={tw(`flex flex-col gap-1 pb-2`)}>
          {outline.elements
            .filter((element) => element.type === 'landmark')
            .map((landmark) => (
              <React.Fragment key={landmark.id}>
                <Text style={tw(`pt-2 border-t border-neutral-300`)}>
                  <Text style={tw(`text-lg font-bold text-lime-800 font-bold leading-4 underline`)}>
                    {landmark.name}
                  </Text>
                  {landmark.name && landmark.description && ': '}
                  {landmark.description}
                </Text>
                <View style={tw(`pl-4`)}>
                  {outline.elements
                    .filter(
                      (element) =>
                        element.parentId === landmark.id && element.type === 'interactable'
                    )
                    .map((interactable) => (
                      <React.Fragment key={interactable.id}>
                        <Text style={tw(`pb-1 text-neutral-900`)}>
                          <Text style={tw(`text-base text-cyan-800 font-bold leading-4`)}>
                            {interactable.name}
                          </Text>
                          {interactable.name && interactable.description && ': '}
                          {interactable.description}
                        </Text>
                        <View style={tw(`pl-4`)}>
                          {outline.elements
                            .filter(
                              (element) =>
                                element.parentId === interactable.id && element.type === 'secret'
                            )
                            .map((secret) => (
                              <React.Fragment key={secret.id}>
                                <Text style={tw(`pb-1 text-neutral-800`)}>
                                  <Text
                                    style={tw(`text-sm text-red-800 font-bold leading-4 underline`)}
                                  >
                                    {secret.name}
                                  </Text>
                                  {secret.name && secret.description && ': '}
                                  {secret.description}
                                </Text>
                                <View
                                  style={tw(
                                    `text-xs pb-1 pl-4 flex flex-col gap-2 leading-4 text-neutral-700`
                                  )}
                                >
                                  <Text>
                                    <Text style={tw(`text-yellow-800 font-bold`)}>Success: </Text>
                                    {secret.rollableSuccess}
                                  </Text>
                                  <Text>
                                    <Text style={tw(`text-yellow-800 font-bold`)}>Failure: </Text>
                                    {secret.rollableFailure}
                                  </Text>
                                </View>
                              </React.Fragment>
                            ))}
                        </View>
                      </React.Fragment>
                    ))}
                </View>
              </React.Fragment>
            ))}
        </View>
      </Page>
    </Document>
  );
};

const OutlinePdfGen: React.FC<OutlinePdfGenProps> = ({ outline, className, children }) => {
  return (
    <PDFDownloadLink
      document={<Output outline={outline} />}
      fileName={`${outline.title} ${dayjs().format('MM-DD-YYYY HH_MM_ss')}`}
      className={cn(``, className)}
    >
      {children}
    </PDFDownloadLink>
  );
};

export default OutlinePdfGen;
