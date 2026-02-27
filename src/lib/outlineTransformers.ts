import {
  Element,
  FlatOutlineElement,
  InteractableNode,
  LandmarkNode,
  OutlineNodeType,
  SecretNode,
} from './types';

type FlatElementWithNullableFields = Omit<FlatOutlineElement, 'parentId'> & {
  parentId: string | null;
};

const toFlatElement = (element: FlatElementWithNullableFields): FlatOutlineElement => ({
  id: element.id,
  parentId: element.parentId,
  type: element.type,
  name: element.name ?? '',
  description: element.description ?? '',
  rollableSuccess: element.rollableSuccess ?? '',
  rollableFailure: element.rollableFailure ?? '',
  userCreatedAt: element.userCreatedAt,
});

export const buildTreeFromFlat = (elements: Element[]): LandmarkNode[] => {
  const landmarks: LandmarkNode[] = elements
    .filter((element) => element.type === 'landmark')
    .map((element) => ({
      ...toFlatElement({
        ...element,
        type: 'landmark',
        parentId: null,
      }),
      type: 'landmark',
      parentId: null,
      children: [],
    }));

  const interactables: InteractableNode[] = elements
    .filter((element) => element.type === 'interactable')
    .map((element) => ({
      ...toFlatElement({
        ...element,
        type: 'interactable',
        parentId: element.parentId ?? '',
      }),
      type: 'interactable',
      parentId: element.parentId ?? '',
      children: [],
    }));

  const secrets: SecretNode[] = elements
    .filter((element) => element.type === 'secret')
    .map((element) => ({
      ...toFlatElement({
        ...element,
        type: 'secret',
        parentId: element.parentId ?? '',
      }),
      type: 'secret',
      parentId: element.parentId ?? '',
      children: [],
    }));

  const landmarksById = new Map<string, LandmarkNode>();
  const interactablesById = new Map<string, InteractableNode>();

  landmarks.forEach((landmark) => landmarksById.set(landmark.id, landmark));
  interactables.forEach((interactable) => interactablesById.set(interactable.id, interactable));

  interactables.forEach((interactable) => {
    const parentLandmark = landmarksById.get(interactable.parentId);
    if (parentLandmark) {
      parentLandmark.children.push(interactable);
    }
  });

  secrets.forEach((secret) => {
    const parentInteractable = interactablesById.get(secret.parentId);
    if (parentInteractable) {
      parentInteractable.children.push(secret);
    }
  });

  return landmarks;
};

const flattenNode = (
  node:
    | { type: 'landmark'; node: LandmarkNode; parentId: null }
    | { type: 'interactable'; node: InteractableNode; parentId: string }
    | { type: 'secret'; node: SecretNode; parentId: string },
  output: FlatOutlineElement[]
) => {
  const flatNode: FlatOutlineElement = {
    id: node.node.id,
    parentId: node.parentId,
    type: node.type,
    name: node.node.name ?? '',
    description: node.node.description ?? '',
    rollableSuccess: node.node.rollableSuccess ?? '',
    rollableFailure: node.node.rollableFailure ?? '',
    userCreatedAt: node.node.userCreatedAt,
  };
  output.push(flatNode);

  if (node.type === 'landmark') {
    node.node.children.forEach((interactable) => {
      flattenNode(
        {
          type: 'interactable',
          node: interactable,
          parentId: node.node.id,
        },
        output
      );
    });
  }

  if (node.type === 'interactable') {
    node.node.children.forEach((secret) => {
      flattenNode(
        {
          type: 'secret',
          node: secret,
          parentId: node.node.id,
        },
        output
      );
    });
  }
};

export const flattenTreeForPersistence = (elements: LandmarkNode[]): FlatOutlineElement[] => {
  const output: FlatOutlineElement[] = [];
  elements.forEach((landmark) => {
    flattenNode(
      {
        type: 'landmark',
        node: landmark,
        parentId: null,
      },
      output
    );
  });
  return output;
};

export const getAllowedChildType = (type: OutlineNodeType): OutlineNodeType | null => {
  switch (type) {
    case 'landmark':
      return 'interactable';
    case 'interactable':
      return 'secret';
    case 'secret':
      return null;
    default:
      return null;
  }
};
