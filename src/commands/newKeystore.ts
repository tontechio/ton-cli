import { prompt } from 'enquirer';
import fs from 'fs';
import { KeyStore } from 'ton';
import { newSecurePassphrase } from 'ton-crypto';
import ora from 'ora';
import { Config } from '../Config';

export async function newKeystore(config: Config) {
    let res = await prompt<{ name: string }>([{
        type: 'input',
        name: 'name',
        message: 'Keystore Name',
        validate: (src) => {
            if (fs.existsSync(src + '.keystore')) {
                return 'File ' + src + '.keystore already exist!';
            }
            return true;
        }
    }]);

    const spinner = ora('Creating a secure keystore').start();

    // Create password
    const passphrase = await newSecurePassphrase(6);

    // Create keystore
    let keystore = await KeyStore.createNew(passphrase);

    // Save keystore
    fs.writeFileSync(res.name + '.keystore', await keystore.save());

    // Complete
    spinner.succeed('Keystore password: ' + passphrase);
}