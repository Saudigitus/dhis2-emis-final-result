import React from "react";
import { ButtonStrip } from "@dhis2/ui";
import SummaryCard from "../../card/SummaryCard";

interface SummaryCardsProps {
    created: []
    conflicts: []
}

function SummaryCards(values: SummaryCardsProps): React.ReactElement {
    const { created, conflicts } = values;
    return (
        <ButtonStrip>
            <SummaryCard color="success" label="Promoted students" value={created.length} />
            <SummaryCard color="error" label="No promoted students" value={conflicts.length} />
        </ButtonStrip>
    );
}

export default SummaryCards;
