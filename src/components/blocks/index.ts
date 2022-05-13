import HueBlock from '/src/components/blocks/HueBlock.ts'
export { HueBlock }

export function getBlocks(): HueBlock[] {
    return [
        new HueBlock("#ff0000"),
        new HueBlock("#00ff00"),
        new HueBlock("#0000ff"),
    ]
}