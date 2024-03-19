declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: any
  }
}

type EnvType = {
  REACT_APP_VERSION: string,
  REACT_APP_AWS_S3_BUCKET_NAME: string,
  REACT_APP_AWS_REGION: string,
  REACT_APP_AWS_ACCESS_KEY_ID: string,
  REACT_APP_AWS_SECRET_ACCESS_KEY: string,
}

// eslint-disable-next-line import/prefer-default-export
export const env: EnvType = { ...import.meta.env, ...window.env };