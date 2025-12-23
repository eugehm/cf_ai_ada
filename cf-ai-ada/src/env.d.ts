/*
 * env.d.ts
 *
 * Type declarations for non-TypeScript module imports.
 */

declare module "*.html" {
    const content: string
    export default content
}