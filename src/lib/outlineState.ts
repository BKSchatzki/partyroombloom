import { InteractableNode, LandmarkNode, Outline, OutlineNodeType, SecretNode } from './types';

type OutlineNodeMeta = {
  id: string;
  parentId: string | null;
  type: OutlineNodeType;
  name: string;
  description: string;
  rollableSuccess: string;
  rollableFailure: string;
  userCreatedAt: string;
};

export type OutlineGraph = {
  id: number | null;
  title: string;
  description: string;
  goal: string;
  comments: string;
  conversations: Outline['conversations'];
  rootIds: string[];
  nodesById: Record<string, OutlineNodeMeta>;
  childIdsByParent: Record<string, string[]>;
};

export type OutlineMode = 'tutorial' | 'new' | 'existing';
export type OutlineMetaField = 'title' | 'description' | 'goal' | 'comments';
export type OutlineNodeField = 'name' | 'description' | 'rollableSuccess' | 'rollableFailure';

const toNodeMeta = (
  node: LandmarkNode | InteractableNode | SecretNode,
  parentId: string | null
): OutlineNodeMeta => ({
  id: node.id,
  parentId,
  type: node.type,
  name: node.name ?? '',
  description: node.description ?? '',
  rollableSuccess: node.rollableSuccess ?? '',
  rollableFailure: node.rollableFailure ?? '',
  userCreatedAt: node.userCreatedAt,
});

const makeNodeDefaults = (
  id: string,
  parentId: string | null,
  type: OutlineNodeType
): OutlineNodeMeta => ({
  id,
  parentId,
  type,
  name: '',
  description: '',
  rollableSuccess: '',
  rollableFailure: '',
  userCreatedAt: new Date().toISOString(),
});

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const getOutlineMode = (tutorialMode: boolean, outlineId?: number | null): OutlineMode => {
  if (tutorialMode) {
    return 'tutorial';
  }
  return outlineId ? 'existing' : 'new';
};

export const normalizeOutline = (outline: Outline): OutlineGraph => {
  const nodesById: Record<string, OutlineNodeMeta> = {};
  const childIdsByParent: Record<string, string[]> = {};
  const rootIds: string[] = [];

  outline.elements.forEach((landmark) => {
    rootIds.push(landmark.id);
    nodesById[landmark.id] = toNodeMeta(landmark, null);
    childIdsByParent[landmark.id] = landmark.children.map((interactable) => interactable.id);

    landmark.children.forEach((interactable) => {
      nodesById[interactable.id] = toNodeMeta(interactable, landmark.id);
      childIdsByParent[interactable.id] = interactable.children.map((secret) => secret.id);

      interactable.children.forEach((secret) => {
        nodesById[secret.id] = toNodeMeta(secret, interactable.id);
      });
    });
  });

  return {
    id: outline.id,
    title: outline.title ?? '',
    description: outline.description ?? '',
    goal: outline.goal ?? '',
    comments: outline.comments ?? '',
    conversations: outline.conversations ?? [],
    rootIds,
    nodesById,
    childIdsByParent,
  };
};

const buildSecretNode = (graph: OutlineGraph, secretId: string): SecretNode | null => {
  const node = graph.nodesById[secretId];
  if (!node || node.type !== 'secret' || typeof node.parentId !== 'string') {
    return null;
  }

  return {
    id: node.id,
    parentId: node.parentId,
    type: 'secret',
    name: node.name,
    description: node.description,
    rollableSuccess: node.rollableSuccess,
    rollableFailure: node.rollableFailure,
    userCreatedAt: node.userCreatedAt,
    children: [],
  };
};

const buildInteractableNode = (
  graph: OutlineGraph,
  interactableId: string
): InteractableNode | null => {
  const node = graph.nodesById[interactableId];
  if (!node || node.type !== 'interactable' || typeof node.parentId !== 'string') {
    return null;
  }

  const secretIds = graph.childIdsByParent[interactableId] ?? [];
  const children = secretIds
    .map((secretId) => buildSecretNode(graph, secretId))
    .filter((secret): secret is SecretNode => secret !== null);

  return {
    id: node.id,
    parentId: node.parentId,
    type: 'interactable',
    name: node.name,
    description: node.description,
    rollableSuccess: node.rollableSuccess,
    rollableFailure: node.rollableFailure,
    userCreatedAt: node.userCreatedAt,
    children,
  };
};

const buildLandmarkNode = (graph: OutlineGraph, landmarkId: string): LandmarkNode | null => {
  const node = graph.nodesById[landmarkId];
  if (!node || node.type !== 'landmark' || node.parentId !== null) {
    return null;
  }

  const interactableIds = graph.childIdsByParent[landmarkId] ?? [];
  const children = interactableIds
    .map((interactableId) => buildInteractableNode(graph, interactableId))
    .filter((interactable): interactable is InteractableNode => interactable !== null);

  return {
    id: node.id,
    parentId: null,
    type: 'landmark',
    name: node.name,
    description: node.description,
    rollableSuccess: node.rollableSuccess,
    rollableFailure: node.rollableFailure,
    userCreatedAt: node.userCreatedAt,
    children,
  };
};

export const denormalizeOutline = (graph: OutlineGraph): Outline => {
  const elements = graph.rootIds
    .map((landmarkId) => buildLandmarkNode(graph, landmarkId))
    .filter((landmark): landmark is LandmarkNode => landmark !== null);

  return {
    id: graph.id,
    title: graph.title,
    description: graph.description,
    goal: graph.goal,
    comments: graph.comments,
    elements,
    conversations: graph.conversations,
  };
};

export const getNodeById = (graph: OutlineGraph, nodeId: string): OutlineNodeMeta | null => {
  return graph.nodesById[nodeId] ?? null;
};

export const getChildIds = (graph: OutlineGraph, parentId: string): string[] => {
  return graph.childIdsByParent[parentId] ?? [];
};

export const getAllInteractableIds = (graph: OutlineGraph): string[] => {
  return graph.rootIds.flatMap((landmarkId) => graph.childIdsByParent[landmarkId] ?? []);
};

export const setOutlineMetaField = (
  graph: OutlineGraph,
  field: OutlineMetaField,
  value: string
): OutlineGraph => {
  if (graph[field] === value) {
    return graph;
  }
  return {
    ...graph,
    [field]: value,
  };
};

export const updateNodeField = (
  graph: OutlineGraph,
  nodeId: string,
  field: OutlineNodeField,
  value: string
): OutlineGraph => {
  const currentNode = graph.nodesById[nodeId];
  if (!currentNode || currentNode[field] === value) {
    return graph;
  }

  return {
    ...graph,
    nodesById: {
      ...graph.nodesById,
      [nodeId]: {
        ...currentNode,
        [field]: value,
      },
    },
  };
};

export const addLandmarkNode = (graph: OutlineGraph): OutlineGraph => {
  const id = crypto.randomUUID();
  const node = makeNodeDefaults(id, null, 'landmark');

  return {
    ...graph,
    rootIds: [...graph.rootIds, id],
    nodesById: {
      ...graph.nodesById,
      [id]: node,
    },
  };
};

export const addChildNode = (
  graph: OutlineGraph,
  parentId: string,
  childType: 'interactable' | 'secret'
): OutlineGraph => {
  const parent = graph.nodesById[parentId];
  if (!parent) {
    return graph;
  }

  const isValidParent =
    (childType === 'interactable' && parent.type === 'landmark') ||
    (childType === 'secret' && parent.type === 'interactable');

  if (!isValidParent) {
    return graph;
  }

  const id = crypto.randomUUID();
  const node = makeNodeDefaults(id, parentId, childType);
  const currentChildIds = graph.childIdsByParent[parentId] ?? [];

  return {
    ...graph,
    nodesById: {
      ...graph.nodesById,
      [id]: node,
    },
    childIdsByParent: {
      ...graph.childIdsByParent,
      [parentId]: [...currentChildIds, id],
    },
  };
};

const collectNodeAndDescendants = (graph: OutlineGraph, nodeId: string): string[] => {
  const queue = [nodeId];
  const collected: string[] = [];

  while (queue.length > 0) {
    const currentId = queue.pop();
    if (!currentId) {
      continue;
    }
    collected.push(currentId);
    const children = graph.childIdsByParent[currentId] ?? [];
    children.forEach((childId) => queue.push(childId));
  }

  return collected;
};

export const deleteNode = (graph: OutlineGraph, nodeId: string): OutlineGraph => {
  const node = graph.nodesById[nodeId];
  if (!node) {
    return graph;
  }

  const idsToDelete = collectNodeAndDescendants(graph, nodeId);
  const idsToDeleteSet = new Set(idsToDelete);

  const nextNodesById = Object.fromEntries(
    Object.entries(graph.nodesById).filter(([id]) => !idsToDeleteSet.has(id))
  );

  const nextChildIdsByParent = Object.fromEntries(
    Object.entries(graph.childIdsByParent)
      .filter(([parentId]) => !idsToDeleteSet.has(parentId))
      .map(([parentId, childIds]) => [
        parentId,
        childIds.filter((childId) => !idsToDeleteSet.has(childId)),
      ])
      .filter(([, childIds]) => childIds.length > 0)
  );

  let nextRootIds = graph.rootIds.filter((id) => !idsToDeleteSet.has(id));
  if (node.parentId) {
    const siblings = graph.childIdsByParent[node.parentId] ?? [];
    nextChildIdsByParent[node.parentId] = siblings.filter((id) => !idsToDeleteSet.has(id));
    if (nextChildIdsByParent[node.parentId].length === 0) {
      delete nextChildIdsByParent[node.parentId];
    }
  } else {
    nextRootIds = nextRootIds.filter((id) => id !== nodeId);
  }

  return {
    ...graph,
    rootIds: nextRootIds,
    nodesById: nextNodesById,
    childIdsByParent: nextChildIdsByParent,
  };
};

export const isOutlineLike = (value: unknown): value is Outline => {
  return isRecord(value) && Array.isArray(value.elements);
};

export const isOutlineGraphLike = (value: unknown): value is OutlineGraph => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    Array.isArray(value.rootIds) &&
    isRecord(value.nodesById) &&
    isRecord(value.childIdsByParent) &&
    Object.prototype.hasOwnProperty.call(value, 'id')
  );
};
