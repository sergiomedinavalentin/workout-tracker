export const sendMailjetMail = (
  to: string,
  subject: string,
  text: string,
  from: string
): void => {
  console.log(`Email to ${to} from ${from} with subject ${subject} and text ${text}`);
};