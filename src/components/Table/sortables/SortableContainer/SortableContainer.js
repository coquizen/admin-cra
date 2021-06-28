import React, { forwardRef } from "react"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItemWrapper from 'components/Table/sortables/SortableItem/SortableItemWrapper'
import styles from "components/Table/sortables/SortableContainer/SortableContainer.module.scss"
import classNames from "classnames";


const Container = forwardRef(({ children, isSubSection, getStyle }, ref) => {
    return (
        <ul style={getStyle} className={classNames(styles.Container, isSubSection && styles.SubSection)} ref={ref}>
            {children}
        </ul>
    )
})

const defaultContainer = ({ isOverContainer }) => ({
    marginTop: 40,
    backgroundColor: isOverContainer ? 'rgb(235,235,235,1)' : 'rgba(246,246,246,1)',
})

const ConditionalContainer = ({ condition, wrapper, children }) => condition ? wrapper(children) : children;

const SortableContainer = ({ nodes, id, menuData, isSubSection }) => {
    const itemIDs = nodes?.map((node) => node.id)
    const { setNodeRef, over, isOver } = useSortable({ id })

    if (itemIDs === undefined) {
        return <></>
    }
    const isOverContainer = isOver || (over ? nodes.includes(over.id) : false)

    return (
        <>
            {isSubSection
                ?
                <>
                    {nodes.map((subsection) => (
                        <Container
                            getStyle={defaultContainer({ isOverContainer })}
                            isSubSection={isSubSection}
                            isOver={isOver}
                            over={over}>
                            <SortableItemWrapper
                                dataID={subsection.id}
                                key={subsection.id}
                                id={subsection.id}
                                menuData={menuData}
                            >
                                {subsection?.items &&
                                    <SortableContext id={subsection.id} items={subsection.items.map(({ id }) => id)} strategy={verticalListSortingStrategy} >
                                        <SortableContainer isSubSection={false} nodes={subsection.items} id={subsection.id} />
                                    </SortableContext>}
                            </SortableItemWrapper>
                        </Container>
                    ))}
                </>
                :
                <Container ref={setNodeRef} isSubSection={isSubSection} isOver={isOver} over={over}>
                    {nodes.map((item) =>
                        <SortableItemWrapper dataID={item.id}
                            key={item.id}
                            id={item.id}
                            menuData={menuData}
                        />
                    )}
                </Container>

            }
        </>
    )
}

export default SortableContainer