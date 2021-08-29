var web3 = require('@solana/web3.js');
const { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
var splToken = require('@solana/spl-token');
const { Token } = require('@solana/spl-token');
const { fs } = require("mz");

async function kk(){
    const connection = new Connection(
        web3.clusterApiUrl('devnet'),
        'confirmed',
    );


async function createKeypairFromFile(){
    const secretKeyString = await fs.readFile("/home/raikou/.config/solana/id.json", {encoding:'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
}

var fromWallet = await createKeypairFromFile();

console.log(fromWallet.publicKey);

var fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction(fromAirdropSignature);

let mint = await Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    splToken.TOKEN_PROGRAM_ID,
);

let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
);

var toWallet = Keypair.generate();

var toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toWallet.publicKey,
);

await mint.mintTo(
    fromTokenAccount.address,
    fromWallet.publicKey,
    [],
    1000000000,
);

await mint.setAuthority(
    mint.publicKey,
    null,
    "MintTokens",
    fromWallet.publicKey,
    []
)

var transaction = new Transaction().add(
    Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        1,
    ),
);

var signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    {commitment: 'confirmed'},
);

console.log('SIGNATURE', signature);

var a = (new TextEncoder().encode(mint));
}

kk();

console.log(new TextDecoder().decode([231,124,145,226,114,146,184,246,82,195,183,69,120,42,91,13,38,132,7,250,148,245,19,56,69,42,27,160,123,134,18,2,56,61,68,133,145,65,166,142,116,214,253,120,52,136,252,213,137,1,52,207,227,19,126,213,1,195,197,52,127,115,248,211]));