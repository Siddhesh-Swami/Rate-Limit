import { v4 as uuidV4 } from "uuid"

export class GlobalService {
    static rateLimitData = {};
    static podId = uuidV4();
    static currentRateRemaining = {};
}
