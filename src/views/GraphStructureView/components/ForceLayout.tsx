import { 
    createStyles, 
    makeStyles,
} from "@material-ui/core";
import { useEffect } from "react";
import { GnnNode } from "../../../types";
import { d3Edge } from "../type";
import * as d3 from 'd3';

export interface ForceLayoutProps {
    index: number,
    width: number,
    height: number,
    nodes: GnnNode[],
    edges: d3Edge[],
}

const useStyles = makeStyles(() => createStyles({

}))

const ForceLayout: React.FC<ForceLayoutProps> = ({
    index,
    width,
    height,
    nodes,
    edges,
}) => {

    // console.log('wyh-test-02', width, height, nodes, edges)

    useEffect(() => {
        const svg = d3.select(`#graph-${index}`);
        svg.selectAll('*').remove();

        svg
        .append('g')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#fff')
        .attr('stroke', '#021D38')
        .attr('stroke-width', 2)
        // .style('border-radius', 4) // 好像没啥用

        const force = d3.forceSimulation(nodes as any)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(edges).id(d => (d as any).id))
        .force('center', d3.forceCenter().x(width / 2).y(height/ 2))

        const drawEdges = svg.append('g')
        .selectAll('line')
        .data(edges)
        .enter()
        .append('line')
        .style('stroke', d => d.isSelected === 1 ? '#7262fd' : '#F08BB4')
        .attr('stroke-opacity', 0.5)

        const drawNodes =svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 5)
        .style('fill', d => {
            if(d.isTrainNode) {
                return d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA'
            } else {
                return d.gnn_prob_label == 1 ? '#B40F0F' : '#A0DC2C'
            }
        })
        .attr('fill-opacity', d => Math.abs(d.gnn_prob_score[0] - d.gnn_prob_score[1]) + 0.3)
        .attr('stroke', d => {
            if(d.isTrainNode) {
                return d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA'
            } else {
                return d.ground_truth_label == 1 ? '#B40F0F' : '#A0DC2C'
            }
        })
        .attr('stroke-width', 2)
        .on('mouseover', d => console.log('wyh', d.id))

        force.on('tick', () => {
            drawEdges
            .attr('x1', d => (d.source as any).x)
            .attr('y1', d => (d.source as any).y)
            .attr('x2', d => (d.target as any).x)
            .attr('y2', d => (d.target as any).y)

            drawNodes
            .attr('cx', d => (d as any).x)
            .attr('cy', d => (d as any).y)
        })

        // if(edges.length < 10) {
        //     force.tick(1)
        // } else {
        //     force.tick(300)
        // }

    }, [nodes, edges])

    return <svg id={`graph-${index}`} width={width} height={height}>

    </svg>
}

export default ForceLayout;