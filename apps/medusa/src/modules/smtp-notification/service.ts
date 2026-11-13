import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import type { Logger, ProviderSendNotificationDTO, ProviderSendNotificationResultsDTO } from "@medusajs/framework/types"
import nodemailer, { type Transporter } from "nodemailer"
import { renderTemplate } from "./templates"

export type SmtpOptions = {
  host: string
  port: number
  user: string
  pass: string
  /** Sender, e.g. "Fini Kura <commandes@example.com>". */
  from: string
}

type InjectedDependencies = { logger: Logger }

/** Sends e-mails through an SMTP server (Hostinger in production), rendering react-email templates. */
class SmtpNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "smtp"

  protected logger_: Logger
  protected options_: SmtpOptions
  protected transporter_: Transporter

  static validateOptions(options: Record<string, unknown>) {
    for (const key of ["host", "port", "user", "pass", "from"]) {
      if (!options[key]) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Option SMTP manquante : ${key}`)
      }
    }
  }

  constructor({ logger }: InjectedDependencies, options: SmtpOptions) {
    super()
    this.logger_ = logger
    this.options_ = options
    const port = Number(options.port)
    this.transporter_ = nodemailer.createTransport({
      host: options.host,
      port,
      secure: port === 465,
      auth: { user: options.user, pass: options.pass },
    })
  }

  async send(notification: ProviderSendNotificationDTO): Promise<ProviderSendNotificationResultsDTO> {
    const email = await renderTemplate(notification.template, notification.data ?? {})
    const info = await this.transporter_.sendMail({
      from: notification.from || this.options_.from,
      to: notification.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })
    return { id: info.messageId }
  }
}

export default SmtpNotificationProviderService
