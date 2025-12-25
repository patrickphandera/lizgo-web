<template>

    <q-card bordered class="col-12 col-sm-12 col-md-12 q-mt-md">
        <q-card-section>
            <div class="text-body1 text-weight-bold">Lesson History</div>
        </q-card-section>

        <q-table flat dense :rows="rows" :columns="columns" row-key="lessonId" :rows-per-page-options="[0]">
            <template #no-data>
                <div class="full-width row flex-center q-pa-md text-grey">
                    No lessons viewed yet
                </div>
            </template>
            <!-- Lesson info -->
            <template #body-cell-lesson="props">
                <q-td>
                    <div class="text-weight-medium text-body2">
                        {{ props.row.lessonTitle }}
                    </div>
                    <div class="text-caption text-grey-7">
                        {{ props.row.subject }} · {{ props.row.topic }} · {{ props.row.curriculum }}
                    </div>
                </q-td>
            </template>

            <!-- Progress -->
            <template #body-cell-progress="props">
                <q-td>
                    <q-linear-progress :value="props.row.progressPercent / 100"
                        :color="props.row.finished ? 'green' : 'primary'" rounded />
                    <div class="text-caption q-mt-xs">
                        {{ props.row.finished ? 'Finished' : props.row.progressPercent + '%' }}
                    </div>
                </q-td>
            </template>

            <!-- Last viewed -->
            <template #body-cell-lastViewed="props">
                <q-td class="text-caption">
                    {{ props.row.lastViewedAt }}
                </q-td>
            </template>

            <!-- Action -->
            <template #body-cell-action="props">
                <q-td align="right">
                    <q-btn flat dense color="primary" class="bg-grey-3" no-caps :to="`/lessons/${props.row.lessonId}`"
                        :label="props.row.finished ? 'Review' : 'Resume'"
                        :icon-right="props.row.finished ? 'mdi-refresh' : 'mdi-play'" />
                </q-td>
            </template>
        </q-table>
    </q-card>
</template>
<script setup>
const columns = [
    { name: 'lesson', label: 'Lesson', field: 'lessonTitle', align: 'left' },
    { name: 'duration', label: 'Duration', field: 'durationMinutes', align: 'left' },
    { name: 'progress', label: 'Progress', field: 'progressPercent', align: 'left' },
    { name: 'lastViewed', label: 'Last Viewed', field: 'lastViewedAt', align: 'left' },
    { name: 'action', label: '', field: 'lessonId', align: 'right' }
]

const rows = [
    {
        lessonId: 'lsn_10231',
        lessonTitle: 'Solving Linear Equations',
        subject: 'Mathematics',
        curriculum: 'Grade 9',
        topic: 'Algebra',
        durationMinutes: 28,
        progressPercent: 100,
        finished: true,
        lastViewedAt: 'Today, 09:15'
    },
    {
        lessonId: 'lsn_10488',
        lessonTitle: 'Introduction to Photosynthesis',
        subject: 'Biology',
        curriculum: 'Grade 8',
        topic: 'Plant Cells',
        durationMinutes: 22,
        progressPercent: 45,
        finished: false,
        lastViewedAt: 'Yesterday, 18:40'
    },
    {
        lessonId: 'lsn_10902',
        lessonTitle: 'Forces and Motion',
        subject: 'Physics',
        curriculum: 'Grade 10',
        topic: 'Newton’s Laws',
        durationMinutes: 35,
        progressPercent: 10,
        finished: false,
        lastViewedAt: '3 days ago'
    }
]
</script>
