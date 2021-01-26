/** @format */
import React, { memo, forwardRef, useState, useEffect, useLayoutEffect } from 'react'
import classNames from 'classnames'
import styles from './Item.module.scss'
import { Handle } from './components/Handle'
import { MiniSectionForm } from 'components/forms'
import { useData } from 'context/DataProvider'
export const Item = memo(
	forwardRef(
		(
			{
				color,
				dragOverlay,
				dragging,
				disabled,
				fadeIn,
				handle,
				height,
				index,
				listeners,
				attributes,
				renderItem,
				sorting,
				style,
				transition,
				transform,
				value,
				wrapperStyle,
				...props
			},
			ref
		) => {
			// const { sectionByIDData } = useData()
			// const itemData = sectionByIDData(value.id)
			// const [data, setData] = useState(value)
			const [itemData, setItemData] = useState(null)
			const [isSubSection, setIsSubSection] = useState(false)

			useEffect(() => {
				if (!dragOverlay) {
					return
				}

				document.body.style.cursor = 'grabbing'

				return () => {
					document.body.style.cursor = ''
				}
			}, [dragOverlay])

			index && console.log(`index: ${index}`)
			itemData && console.log(`itemData: ${itemData.section_parent_id}`)
			useLayoutEffect(() => {
				if (index === 0) {
					setIsSubSection(false)
				} else {
					setIsSubSection(true)
				}
			}, [index, itemData])

			useEffect(() => {
				fetch(`/sections/${value}`)
					.then((response) => response.json())
					.then(({ data }) => setItemData(data))
			}, [])

			return (
				<li
					className={classNames(
						styles.Wrapper,
						fadeIn && styles.fadeIn,
						sorting && styles.sorting,
						dragOverlay && styles.dragOverlay
					)}
					style={{
						...wrapperStyle,
						marginLeft: isSubSection ? '1rem' : '',
						transition,
						'--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
						'--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
						'--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
						'--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
						'--index': index,
						'--color': color,
					}}
					ref={ref}>
					<div
						className={classNames(
							styles.Item,
							dragging && styles.dragging,
							styles.withHandle,
							dragOverlay && styles.dragOverlay,
							disabled && styles.disabled,
							color && styles.color
						)}
						tabIndex={!handle ? 0 : undefined}
						style={style}
						data-cypress='draggable-item'
						{...props}>
						{itemData && <MiniSectionForm data={itemData} listeners={listeners} attributes={attributes} />}
					</div>
				</li>
			)
		}
	)
)

const SectionTriage = ({ isSubSection, children }) => (
	<>{isSubSection ? <div style={{ marginLeft: '1rem' }}>{children}</div> : <>{children}</>}</>
)
