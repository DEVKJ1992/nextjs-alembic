declare module 'nodemailer-sparkpost-transport' {
    import { Transporter } from 'nodemailer';

    interface SparkPostOptions {
        sparkPostApiKey: string;
    }

    function sparkPostTransport(options: SparkPostOptions): Transporter;

    export = sparkPostTransport;
}
