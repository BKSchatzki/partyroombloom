export const sceneInit = {
  info: {
    name: '',
    description: '',
    movement: '',
    flavor: '',
  },
  landmarkThings: [
    {
      landmarkName: '',
      landmarkDescription: '',
      hiddenThings: [
        {
          hiddenName: '',
          hiddenDescription: '',
          hasSecret: false,
          secretThings: [
            {
              secretName: '',
              secretDescription: '',
              onSuccess: '',
              onFailure: '',
            },
          ],
        },
      ],
    },
  ],
};
