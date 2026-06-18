// Walrus Agent Memory Index Contract
// On-chain metadata and access control for agent memories

module walrus_memory::memory_index {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;

    // ============ Events ============

    struct MemoryStored has copy, drop {
        memory_id: ID,
        owner: address,
        memory_type: String,
        walrus_id: String,
        timestamp: u64,
    }

    struct MemoryShared has copy, drop {
        memory_id: ID,
        owner: address,
        grantee: address,
        permissions: u8,
        timestamp: u64,
    }

    struct MemoryDeleted has copy, drop {
        memory_id: ID,
        owner: address,
        timestamp: u64,
    }

    // ============ Structs ============

    struct MemoryRecord has key, store {
        id: UID,
        owner: address,
        memory_type: String,
        walrus_id: String,
        created_at: u64,
        updated_at: u64,
        version: u64,
        importance: u8,
        encrypted: bool,
        checksum: String,
        ttl: u64,
    }

    struct MemoryIndex has key {
        id: UID,
        owner: address,
        memory_count: u64,
        created_at: u64,
    }

    struct MemoryGrant has key, store {
        id: UID,
        memory_id: ID,
        grantor: address,
        grantee: address,
        permissions: u8,
        granted_at: u64,
        expires_at: u64,
        revoked: bool,
    }

    // ============ Constants ============
    const PERM_READ: u8 = 0x01;
    const PERM_WRITE: u8 = 0x02;
    const PERM_DELETE: u8 = 0x04;
    const PERM_SHARE: u8 = 0x08;
    const PERM_ADMIN: u8 = 0x10;

    // ============ Functions ============

    public fun init_user_memory_index(ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        let index = MemoryIndex {
            id: object::new(ctx),
            owner,
            memory_count: 0,
            created_at: 0,
        };
        transfer::transfer(index, owner);
    }

    public fun store_memory(
        index: &mut MemoryIndex,
        memory_type: String,
        walrus_id: String,
        importance: u8,
        encrypted: bool,
        checksum: String,
        ttl: u64,
        timestamp: u64,
        ctx: &mut TxContext,
    ) {
        let owner = tx_context::sender(ctx);
        assert!(index.owner == owner, 0);

        let memory = MemoryRecord {
            id: object::new(ctx),
            owner,
            memory_type,
            walrus_id,
            created_at: timestamp,
            updated_at: timestamp,
            version: 1,
            importance,
            encrypted,
            checksum,
            ttl,
        };

        index.memory_count = index.memory_count + 1;
        transfer::transfer(memory, owner);
    }

    public fun grant_access(
        grantor: address,
        memory_id: ID,
        grantee: address,
        permissions: u8,
        expires_at: u64,
        timestamp: u64,
        ctx: &mut TxContext,
    ) {
        let grant = MemoryGrant {
            id: object::new(ctx),
            memory_id,
            grantor,
            grantee,
            permissions,
            granted_at: timestamp,
            expires_at,
            revoked: false,
        };

        transfer::transfer(grant, grantee);
    }

    public fun revoke_access(
        grant: &mut MemoryGrant,
    ) {
        grant.revoked = true;
    }

    // ============ Utility Functions ============

    public fun has_permission(grant: &MemoryGrant, permission: u8): bool {
        !grant.revoked && (grant.permissions & permission == permission)
    }

    public fun is_expired(grant: &MemoryGrant, now: u64): bool {
        grant.expires_at > 0 && grant.expires_at < now
    }

    public fun get_memory_type(record: &MemoryRecord): &String {
        &record.memory_type
    }

    public fun get_owner(record: &MemoryRecord): address {
        record.owner
    }

    public fun get_walrus_id(record: &MemoryRecord): &String {
        &record.walrus_id
    }
}
