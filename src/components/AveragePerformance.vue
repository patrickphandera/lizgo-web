<template>
    <div class="col-12 col-sm-6 col-md-6 ">
        <q-card class="q-ma-sm">
            <q-card-section>
                <div class="text-body1 text-weight-bold">
                    Average Performance by Subject
                </div>
            </q-card-section>

            <q-table flat dense :rows="rows" :columns="columns" row-key="subject" v-model:pagination="pagination"
                :rows-per-page-options="[5, 10, 15]">
                <!-- Subject -->
                <template #body-cell-subject="props">
                    <q-td>
                        <div class="text-weight-medium">
                            {{ props.row.subject }}
                        </div>
                        <div class="text-caption text-grey-7">
                            {{ props.row.curriculum }}
                        </div>
                    </q-td>
                </template>

                <!-- Lessons -->
                <template #body-cell-lessons="props">
                    <q-td class="text-caption">
                        {{ props.row.lessonsAttempted }}
                    </q-td>
                </template>

                <!-- Completed -->
                <template #body-cell-completed="props">
                    <q-td class="text-caption">
                        {{ props.row.completedLessons }}
                    </q-td>
                </template>

                <!-- Average Progress -->
                <template #body-cell-average="props">
                    <q-td>
                        <div class="text-caption q-mt-xs">
                            {{ props.row.averageProgressPercent }}%
                        </div>
                    </q-td>
                </template>
            </q-table>
        </q-card>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const pagination = ref({
    page: 1,
    rowsPerPage: 3
})

const columns = [
    {
        name: 'subject',
        label: 'Subject',
        field: 'subject',
        align: 'left',
        sortable: true
    },
    {
        name: 'lessons',
        label: 'Total Lessons',
        field: 'lessonsAttempted',
        align: 'left',
        sortable: true
    },
    {
        name: 'completed',
        label: 'Completed',
        field: 'completedLessons',
        align: 'left',
        sortable: true
    },
    {
        name: 'average',
        label: 'Average',
        field: 'averageProgressPercent',
        align: 'left',
        sortable: true
    }
]

const rows = [
    {
        subject: 'Mathematics',
        curriculum: 'Grade 9',
        lessonsAttempted: 18,
        completedLessons: 12,
        averageProgressPercent: 82
    },
    {
        subject: 'Biology',
        curriculum: 'Grade 8',
        lessonsAttempted: 14,
        completedLessons: 7,
        averageProgressPercent: 56
    },
    {
        subject: 'Physics',
        curriculum: 'Grade 10',
        lessonsAttempted: 10,
        completedLessons: 4,
        averageProgressPercent: 41
    },
    {
        subject: 'Chemistry',
        curriculum: 'Grade 9',
        lessonsAttempted: 9,
        completedLessons: 6,
        averageProgressPercent: 67
    },
    {
        subject: 'Geography',
        curriculum: 'Grade 8',
        lessonsAttempted: 7,
        completedLessons: 5,
        averageProgressPercent: 71
    },
    {
        subject: 'History',
        curriculum: 'Grade 9',
        lessonsAttempted: 11,
        completedLessons: 9,
        averageProgressPercent: 88
    }
]
</script>
