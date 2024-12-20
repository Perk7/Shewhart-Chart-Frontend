import { TableData } from "../../../types";

export default function parse(content: string): TableData {
    const lines = content.split("\n").map(line => line.trim()).filter(line => line);

    const parameters_quantity = parseInt(lines[0].split(":")[1].trim(), 10);
    const subgroups_quantity = parseInt(lines[1].split(":")[1].trim(), 10);
    const subgroups_size = parseInt(lines[2].split(":")[1].trim(), 10);

    let parametersString = lines[3].split(":")[1].trim()
    let parameters
    if (parametersString)
        parameters = parametersString.split(",").map(param => param.trim());
    else
        parameters = []

        let additional_parametersString = lines[4].split(":")[1].trim()
        let additional_parameters
        if (additional_parametersString)
            additional_parameters = additional_parameters.split(",").map(param => param.trim());
        else
            additional_parameters = []

        const tableStartIndex = 6;
        const table = lines.slice(tableStartIndex).map((line) => {
            const [subgroup, disabled, size, ...rest] = line.split(",").map((item) => item.trim());
            const parsedRow = {
            subgroup: parseInt(subgroup, 10),
            disabled: disabled === "true",
            size: parseInt(size, 10),
            };

            parameters.forEach((param, index) => {
            parsedRow[param] = parseFloat(rest[index]);
            });

            additional_parameters.forEach((param, index) => {
            parsedRow[param] = rest[parameters.length + index];
            });

            return parsedRow;
        });

    return {
        parameters_quantity,
        subgroups_quantity,
        subgroups_size,
        parameters,
        additional_parameters,
        table,
    };
}