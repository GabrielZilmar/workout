import * as Mustache from 'mustache';

type EmailTemplateParams = {
  username: string;
  baseUrl: string;
  forgotPasswordToken: string;
};

export default class ForgotPasswordTemplate {
  private static template = `
      <h1>Recover password</h1>
      <p>Hi, {{username}}! Click in the link below to reset your password</p>
      <a href="{{baseUrl}}?token={{forgotPasswordToken}}">Reset password</a>
    `;
  public static subject = 'Recover password';

  public static renderTemplate({
    username,
    baseUrl,
    forgotPasswordToken,
  }: EmailTemplateParams) {
    return Mustache.render(this.template, {
      username,
      baseUrl,
      forgotPasswordToken,
    });
  }
}
