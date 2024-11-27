import axios from 'axios';
import { STRAPI_URL, STRAPI_API_TOKEN } from '@env';

interface StrapiResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: {};
}

interface Lesson {
  LessonTitle: string;
  LessonDescription: string;
  LessonVideoUrl: string;
  LessonDuration: string;
  LessonOrder: number;
  LessonIsLocked: boolean;
  course: {
    data: {
      id: number;
      attributes: Course;
    };
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Course {
  id: number;
  documentId: string;
  CourseTitle: string;
  CourseDescription: any[];
  CourseCategory: string;
  CourseDuration: string;
  CourseRating: number;
  CourseInstructor: string | null;
  CourseVideoUrl: string;
  CourseProgress?: number;
  CourseStatus?: string;
  CourseThumbnail: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail?: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
      small?: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
      medium?: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
      large?: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  course?: {
    id: number;
    documentId: string;
    Description: string;
    Duration: string;
    Order: number;
    IsLocked: boolean | null;
    VideoUrl: string;
    LessonTitle: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

interface UserProfile {
  username: string;
  email: string;
  name: string;
  bio: string;
  profileImage?: {
    data: {
      id: number;
      attributes: {
        url: string;
        formats: {
          thumbnail: {
            url: string;
          };
        };
      };
    };
  };
}

interface UpdateUserProfileData {
  username?: string;
  name?: string;
  bio?: string;
}

interface LoginData {
  identifier: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  jwt: string;
  refreshToken: string;
  user: UserProfile;
}

interface RefreshTokenResponse {
  jwt: string;
  refreshToken: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  code: string;
  password: string;
  passwordConfirmation: string;
}

// Rate limiting configuration
const rateLimiter = {
  maxAttempts: 5,
  timeWindow: 15 * 60 * 1000, // 15 minutes
  attempts: new Map<string, { count: number; timestamp: number }>(),
};

const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const attempt = rateLimiter.attempts.get(key);

  if (!attempt) {
    rateLimiter.attempts.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (now - attempt.timestamp > rateLimiter.timeWindow) {
    rateLimiter.attempts.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (attempt.count >= rateLimiter.maxAttempts) {
    return false;
  }

  attempt.count += 1;
  return true;
};

const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  },
});

// Add request interceptor for debugging
strapiApi.interceptors.request.use(request => {
  console.log('Request URL:', request.url);
  console.log('Request Headers:', request.headers);
  return request;
});

// Add response interceptor for debugging
strapiApi.interceptors.response.use(response => {
  console.log('Response Data:', JSON.stringify(response.data, null, 2));
  return response;
});

const fetchCourses = async () => {
  try {
    console.log('Fetching courses from:', `${STRAPI_URL}/api/courses?populate=*`);
    const response = await strapiApi.get<StrapiResponse<Course>>('/courses?populate=*');
    console.log('Courses response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching courses:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('Error fetching courses:', error);
    }
    throw error;
  }
};

const fetchCourseByDocumentId = async (documentId: string) => {
  try {
    console.log('Fetching course with documentId:', documentId);
    
    // Fetch the course
    const courseResponse = await strapiApi.get<StrapiResponse<Course>>(
      `/courses?populate=*&filters[documentId][$eq]=${documentId}`
    );
    
    console.log('Course response:', courseResponse.data);

    if (!courseResponse.data?.data?.[0]) {
      throw new Error('Course not found');
    }

    // Extract the course
    const course = courseResponse.data.data[0];
    
    // Fetch lessons for this course
    const lessonsResponse = await strapiApi.get<StrapiResponse<Lesson>>(
      `/lessons?populate=*&filters[course][id][$eq]=${course.id}&sort=LessonOrder:asc`
    );
    
    console.log('Lessons response:', lessonsResponse.data);

    // Map the lessons data if available
    const lessons = lessonsResponse.data?.data?.map(lesson => ({
      id: lesson.id,
      documentId: String(lesson.id),
      LessonTitle: lesson.LessonTitle || 'Untitled Lesson',
      LessonDescription: lesson.LessonDescription || '',
      LessonVideoUrl: lesson.LessonVideoUrl || '',
      LessonDuration: lesson.LessonDuration || '0',
      LessonOrder: lesson.LessonOrder || 0,
      LessonIsLocked: lesson.LessonIsLocked || false
    })) || [];

    // Return in the expected format with all fields directly on the data object
    return {
      data: {
        id: course.id,
        documentId: course.documentId,
        CourseTitle: course.CourseTitle,
        CourseDescription: course.CourseDescription || [],
        CourseCategory: course.CourseCategory,
        CourseDuration: course.CourseDuration,
        CourseRating: course.CourseRating,
        CourseInstructor: course.CourseInstructor,
        CourseVideoUrl: course.CourseVideoUrl,
        CourseProgress: course.CourseProgress,
        CourseStatus: course.CourseStatus,
        CourseThumbnail: course.CourseThumbnail,
        lessons
      }
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

const fetchCourseById = async (id: number) => {
  try {
    const response = await strapiApi.get<StrapiSingleResponse<Course>>(`/courses/${id}?populate=*`);
    console.log('Course response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching course:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        details: error.response?.data?.error?.details,
        name: error.name,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    } else {
      console.error('Error fetching course:', error);
    }
    throw error;
  }
};

const fetchLessons = async (courseId: string | number) => {
  try {
    // Convert string ID to number if it's not already a number
    const numericId = typeof courseId === 'string' ? parseInt(courseId) : courseId;
    const query = `/lessons?populate=*&filters[course][id][$eq]=${numericId}&sort[0]=LessonOrder:asc`;
    console.log('Fetching lessons from:', `${STRAPI_URL}/api${query}`);
    const response = await strapiApi.get<StrapiResponse<Lesson>>(query);
    console.log('Lessons response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching lessons:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        details: error.response?.data?.error?.details,
        name: error.name,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    } else {
      console.error('Error fetching lessons:', error);
    }
    throw error;
  }
};

const fetchResources = async (lessonId: string) => {
  try {
    console.log('Fetching resources from:', `${STRAPI_URL}/api/resources?filters[lesson]=${lessonId}&populate=*`);
    const response = await strapiApi.get<StrapiResponse<any>>(`/resources?filters[lesson]=${lessonId}&populate=*`);
    console.log('Resources response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching resources:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('Error fetching resources:', error);
    }
    throw error;
  }
};

const fetchCategories = async () => {
  try {
    console.log('Fetching categories from:', `${STRAPI_URL}/api/categories?populate=*`);
    const response = await strapiApi.get<StrapiResponse<any>>('/categories?populate=*');
    console.log('Categories response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching categories:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('Error fetching categories:', error);
    }
    throw error;
  }
};

const uploadProfileImage = async (file: File, token: string) => {
  // Validate file type and size
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Please upload an image smaller than 5MB.');
  }

  const formData = new FormData();
  formData.append('files', file);

  try {
    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data[0];
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

const updateUserProfile = async (userId: number, data: UpdateUserProfileData, profileImage?: File, token: string) => {
  try {
    let imageId;
    if (profileImage) {
      const uploadedImage = await uploadProfileImage(profileImage, token);
      imageId = uploadedImage.id;
    }

    const updateData = {
      ...data,
      ...(imageId && { profileImage: imageId }),
    };

    const response = await strapiApi.put(`/users/${userId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const getUserProfile = async (userId: number, token: string): Promise<UserProfile> => {
  try {
    const response = await strapiApi.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

const login = async (data: LoginData): Promise<AuthResponse> => {
  if (!checkRateLimit(`login:${data.identifier}`)) {
    throw new Error('Too many login attempts. Please try again later.');
  }

  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/auth/local`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const register = async (data: RegisterData): Promise<AuthResponse> => {
  if (!checkRateLimit(`register:${data.email}`)) {
    throw new Error('Too many registration attempts. Please try again later.');
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(data.password)) {
    throw new Error(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Please enter a valid email address.');
  }

  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/auth/local/register`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

const refreshToken = async (token: string, refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/auth/refresh-token`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
  try {
    await axios.post(
      `${STRAPI_URL}/api/auth/forgot-password`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

const resetPassword = async (data: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/auth/reset-password`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

const verifyEmail = async (confirmation: string): Promise<void> => {
  try {
    await axios.get(
      `${STRAPI_URL}/api/auth/email-confirmation?confirmation=${confirmation}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

const sendEmailConfirmation = async (email: string): Promise<void> => {
  try {
    await axios.post(
      `${STRAPI_URL}/api/auth/send-email-confirmation`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Send email confirmation error:', error);
    throw error;
  }
};

const changePassword = async (
  currentPassword: string,
  newPassword: string,
  userId: number,
  token: string
): Promise<void> => {
  try {
    await strapiApi.post(
      `/auth/change-password`,
      {
        currentPassword,
        newPassword,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

const createAuthenticatedApi = (token: string, refreshToken: string, onTokenRefresh: (newToken: string, newRefreshToken: string) => void) => {
  const api = axios.create({
    baseURL: `${STRAPI_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await refreshToken(token, refreshToken);
          const { jwt: newToken, refreshToken: newRefreshToken } = response;
          
          onTokenRefresh(newToken, newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

async function publishCourse(courseId: string, token: string) {
  try {
    await axios({
      method: 'POST',
      url: `${STRAPI_URL}/content-manager/collection-types/api::course.course/${courseId}/actions/publish`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return true;
  } catch (error: any) {
    console.error('Publish error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return false;
  }
}

async function updateCourse(courseId: string, data: Partial<Course>, token: string) {
  // Check rate limit
  const rateKey = `updateCourse_${courseId}`;
  if (!checkRateLimit(rateKey)) {
    throw new Error('Too many update attempts. Please wait a few minutes and try again.');
  }

  try {
    // Prepare the update data, only including fields that are actually provided
    const updateFields: any = {};

    // Only include fields that are actually provided in the data
    if (data.CourseTitle !== undefined) updateFields.CourseTitle = data.CourseTitle;
    if (data.CourseDescription !== undefined) updateFields.CourseDescription = data.CourseDescription;
    if (data.CourseCategory !== undefined) updateFields.CourseCategory = data.CourseCategory;
    if (data.CourseDuration !== undefined) updateFields.CourseDuration = data.CourseDuration;
    if (data.CourseRating !== undefined) updateFields.CourseRating = data.CourseRating;
    if (data.CourseInstructor !== undefined) updateFields.CourseInstructor = data.CourseInstructor;
    if (data.CourseVideoUrl !== undefined) updateFields.CourseVideoUrl = data.CourseVideoUrl;
    if (data.CourseProgress !== undefined) updateFields.CourseProgress = data.CourseProgress;
    if (data.CourseStatus !== undefined) updateFields.CourseStatus = data.CourseStatus;

    // Handle thumbnail relationship if it exists
    if (data.CourseThumbnail?.data?.id) {
      updateFields.CourseThumbnail = data.CourseThumbnail.data.id;
    }

    console.log('Updating course with data:', JSON.stringify(updateFields, null, 2));

    // Update the course
    const response = await axios({
      method: 'PUT',
      url: `${STRAPI_URL}/content-manager/collection-types/api::course.course/${courseId}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: updateFields
    });

    console.log('Course update response:', response.data);

    // Wait before attempting to publish
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to publish if rate limit allows
    if (checkRateLimit(`${rateKey}_publish`)) {
      const published = await publishCourse(courseId, token);
      if (!published) {
        console.warn('Course updated but publish operation failed');
      }
    } else {
      console.warn('Course updated but skipped publish due to rate limit');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Update error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.response?.data?.message;
      
      if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      } else if (status === 403) {
        throw new Error('You do not have permission to update this course.');
      } else if (status === 400) {
        throw new Error(`Invalid course data provided: ${message}`);
      } else {
        throw new Error(`Failed to update course: ${message || error.message}`);
      }
    }
    throw error;
  }
}

export {
  fetchCourses,
  fetchCourseByDocumentId,
  fetchCourseById,
  fetchLessons,
  fetchResources,
  fetchCategories,
  uploadProfileImage,
  updateUserProfile,
  getUserProfile,
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendEmailConfirmation,
  changePassword,
  updateCourse,
  createAuthenticatedApi,
};
