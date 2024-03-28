import * as Mustache from 'mustache';

type EmailTemplateParams = {
  username: string;
  baseUrl: string;
  verifyEmailToken: string;
};

export default class VerifyEmailTemplate {
  private static template = `
      <h1>Verify your email</h1>
      <p>Hi, {{username}}! Click in the link below to verify your email</p>
      <a href="{{baseUrl}}/api/session/verify-email?token={{verifyEmailToken}}">Verify email</a>
    `;
  public static subject = 'Verify your email';

  public static renderTemplate({
    username,
    baseUrl,
    verifyEmailToken,
  }: EmailTemplateParams) {
    return Mustache.render(this.template, {
      username,
      baseUrl,
      verifyEmailToken,
    });
  }
}
