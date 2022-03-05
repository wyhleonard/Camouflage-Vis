export interface RevealViewProps {

}

const projectType = [
    'clustering',
    'gnn score',
    'fcn score'
] as const 

export type projectType = typeof projectType[number];