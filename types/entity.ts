import { QueryParams } from './query_params.js'
import { CustomField } from './custom_fields.js'
import { CreateResponse, UpdateResponse } from './responses.js'
import { Lead } from './lead.js'
import { Contact } from './contact.js'
import { Company } from './company.js'
import type { Note } from './note.js'
import type { Task } from './task.js'
import type { ArrayOfEntities } from '../classes/helpers/ArraysOfEntities.js'

/**
 * Branded type for entity IDs to prevent accidental mixing of different entity IDs.
 * @template T - The entity type this ID belongs to (e.g., 'Lead', 'Contact', 'Company')
 */
export type EntityId<T extends string> = number & { readonly __brand: T }

/** Type-safe ID types for each main entity */
export type LeadId = EntityId<'Lead'>
export type ContactId = EntityId<'Contact'>
export type CompanyId = EntityId<'Company'>
export type UserId = EntityId<'User'>
export type PipelineId = EntityId<'Pipeline'>
export type TagId = EntityId<'Tag'>
export type TaskId = EntityId<'Task'>
export type NoteId = EntityId<'Note'>

/**
 * Result type for operations that can succeed or fail.
 * Provides type-safe error handling without exceptions.
 * @template T - Success value type
 * @template E - Error type (defaults to Error)
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

/** Helper to create a successful Result */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

/** Helper to create a failed Result */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

/** Type guard to check if Result is successful */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok
}

/** Type guard to check if Result is an error */
export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok
}

export type MainEntitiesType = 'leads' | 'contacts' | 'companies'
export type EntitiesType = 'notes' | 'tasks' | 'leads/notes' | 'contacts/notes' | 'companies/notes'

/**
 * Interface for main entities (leads, contacts, companies) that support
 * full CRUD operations, linking, and custom field access.
 */
export interface MainEntityClass<E extends EntityWithEntry, Q extends QueryParams> {
  /** API endpoint URL */
  url: string
  /**
   * Fetch entities with pagination.
   * @param params - Query parameters for filtering, sorting, etc.
   * @param page - Page number (1-based)
   * @param acc - Accumulator for recursive pagination
   * @returns ArrayOfEntities with helper methods
   */
  get(params: Q, page: number, acc: E[]): Promise<ArrayOfEntities<E>>
  /**
   * Create new entities.
   * @param entities - Array of partial entity data (must include required fields)
   * @returns Array of created entity responses with IDs
   */
  create(entities: Partial<E>[]): Promise<CreateResponse[]>
  /**
   * Update existing entities.
   * @param entities - Array of entities with ID and fields to update
   * @returns Array of updated entity responses
   */
  update(entities: PartialExcept<E, 'id'>[]): Promise<UpdateResponse[]>
  /**
   * Link this entity to other entities.
   * @param entity - Type of entity to link to
   * @param id - ID of this entity
   * @param linkIds - IDs of entities to link
   */
  link(entity: MainEntitiesType, id: number, linkIds: number[]): Promise<void>
  /**
   * Unlink this entity from other entities.
   * @param entity - Type of entity to unlink from
   * @param id - ID of this entity
   * @param linkIds - IDs of entities to unlink
   */
  unlink(entity: MainEntitiesType, id: number, linkIds: number[]): Promise<void>
  /**
   * Get a custom field by its numeric ID.
   * @param entity - Entity to search in
   * @param id - Numeric field ID
   * @returns CustomField or null if not found
   */
  getCustomFieldById(entity: E, id: number): CustomField | null
  /**
   * Find the newest entity by timestamp field.
   * @param entities - Array of entities to search
   * @param by - Field to compare ('created_at' or 'updated_at')
   * @returns The newest entity
   */
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E
  /**
   * Find the oldest entity by timestamp field.
   * @param entities - Array of entities to search
   * @param by - Field to compare ('created_at' or 'updated_at')
   * @returns The oldest entity
   */
  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E
}

/**
 * Interface for simple entities (notes, tasks) that support
 * basic CRUD operations without linking or custom fields.
 */
export interface EntityClass<E extends EntitiesFields, Q extends QueryParams> {
  /** API endpoint URL */
  url: string
  /**
   * Fetch entities with pagination.
   * @param params - Query parameters
   * @param page - Page number (1-based)
   * @param acc - Accumulator for recursive pagination
   * @returns Array of entities
   */
  get(params: Q, page: number, acc: E[]): Promise<E[]>
  /**
   * Create new entities.
   * @param entities - Array of partial entity data
   * @returns Array of created entity responses
   */
  create(entities: Partial<E>[]): Promise<CreateResponse[]>
  /**
   * Update existing entities.
   * @param entities - Array of entities with ID and fields to update
   * @returns Array of updated entity responses
   */
  update(entities: PartialExcept<E, 'id'>[]): Promise<UpdateResponse[]>
  /**
   * Find the newest entity by timestamp field.
   * @param entities - Array of entities to search
   * @param by - Field to compare ('created_at' or 'updated_at')
   * @returns The newest entity
   */
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E | undefined
  /**
   * Find the oldest entity by timestamp field.
   * @param entities - Array of entities to search
   * @param by - Field to compare ('created_at' or 'updated_at')
   * @returns The oldest entity
   */
  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E | undefined
}

/** Additional fields for updating main entities (tags management) */
export interface ToUpdate {
  /** Tags to add by ID or name */
  tags_to_add?: { id?: number; name?: string }[]
  /** Tags to remove by ID or name */
  tags_to_delete?: { id?: number; name?: string }[]
}

/** Utility type: make all properties optional except K */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>

/** Data structure for linking entities */
export interface LinkData {
  /** ID of the source entity */
  entity_id: number
  /** ID of the target entity to link to */
  to_entity_id: number
  /** Type of the target entity */
  to_entity_type: MainEntitiesType
}

/** Data structure for unlinking entities (same as LinkData) */
export type UnlinkData = LinkData

/** Union of main entity types that have custom fields and embedded relations */
export type EntityWithEntry = Lead | Contact | Company

/** Array of main entities */
export type ArrayOfEntity = EntityWithEntry[]

/** Union of simple entity types (notes, tasks) */
export type EntitiesFields = Note | Task

/** Main entities that support extended update operations (tags) */
export type ExtendableEntitiesForUpdate = EntityWithEntry
