import { ClientSession } from "mongoose";
import { ITransfer } from "./transfer.js";

/**
 * this class contains methods to interact with the database methods
 * 
 * @returns implementation of all the transfer model method
 */
const statics = {

    /**
     * Get the last block number in the transfer collection for matic transfers
     * 
     * @returns {Promise<number>}
     */
    async getLastTransferBlock(): Promise<number> {
        //@ts-ignore
        const tx = await this.findOne().sort({ timestamp: -1 }).exec();

        return tx?.blockNumber || 0;
    },

    /**
     * Inserts multiple documents for matic transfers into transfer collection 
     * 
     * @param {ITransfer[]} data 
     * @param {ClientSession} session 
     * 
     * @returns {Promise<void>}
     */
    async addAllTransfers(data: ITransfer[], session: ClientSession): Promise<void> {
        for (let transfer of data) {
            //@ts-ignore
            await this.create([transfer], { rawResult: false, session: session });
        }
        return;
    },

    /**
     * Deletes all the transactions for reorg
     * 
     * @param {number} blockNumber 
     * @param {ClientSession} session 
     * 
     * @returns {Promise<number>}
     */
    async deleteTxsForReorg(blockNumber: number, session: ClientSession): Promise<number> {

        let deletedCount = (
            //@ts-ignore
            await this.deleteMany({ blockNumber: { $gte: blockNumber } }, { session })
        ).deletedCount;

        return deletedCount;
    }
}

export default statics;
