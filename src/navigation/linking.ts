import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<any> = {
  prefixes: ['http://localhost:19006', 'http://localhost:19000', 'exp://'],
  config: {
    screens: {
      Login: 'login',
      Home: '',
      MyCourses: 'my-courses',
      CourseDetail: 'course/:courseId',
      CoursePlayer: 'course/:documentId/learn',
      Settings: 'settings',
      Help: 'help',
    },
  },
};
