// services/api.js (müştəri tərəf)
import { API_URL, USE_REAL_API, REQUEST_TIMEOUT, defaultHeaders, ERROR_MESSAGES } from './config';

/**
 * Ümumi fetch funksiyası - bütün API sorğuları buradan keçir
 */
export const apiFetch = async (endpoint, options = {}) => {
  if (!USE_REAL_API) {
    console.log(`🔧 Mock mode: ${endpoint} sorğusu edilmədi`);
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      } else if (response.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || ERROR_MESSAGES.DEFAULT);
      }
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Sorğu çox uzun çəkdi. Zəhmət olmasa təkrar cəhd edin.');
    }
    
    if (error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    throw error;
  }
};

export const apiGet = (endpoint, options = {}) => {
  return apiFetch(endpoint, { ...options, method: 'GET' });
};

export const apiPost = (endpoint, data, options = {}) => {
  return apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};