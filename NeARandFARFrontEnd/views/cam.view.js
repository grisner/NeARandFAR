
const camView = Vue.component('camview', {
    created: function() {
        console.log('position in cam.view', gpsService.position.coords.latitude);
        this.assets();

        AFRAME.registerComponent('cursor-listener', {
            init: function() {
                console.log('test');
            }
        });

    },
    mounted: function() {
        console.log('mounting cam view');
    },
    methods: {
        compass: function () {
            console.log('adding compass at ', gpsService.position.coords.latitude, gpsService.position.coords.longitude);
            return [
                {
                    geometry: 'text',
                    scale: '60 60 60',
                    value: 'north',
                    position: {
                        lat: gpsService.position.coords.latitude + 0.001,
                        lon: gpsService.position.coords.longitude,
                    }
                },
                {
                    geometry: 'text',
                    scale: '60 60 60',
                    value: 'south',
                    position: {
                        lat: gpsService.position.coords.latitude - 0.001,
                        lon: gpsService.position.coords.longitude,
                    }
                },
                {
                    geometry: 'text',
                    scale: '60 60 60',
                    value: 'east',
                    position: {
                        lat: gpsService.position.coords.latitude,
                        lon: gpsService.position.coords.longitude + 0.001,
                    }
                },
                {
                    geometry: 'text',
                    scale: '60 60 60',
                    value: 'west',
                    position: {
                        lat: gpsService.position.coords.latitude,
                        lon: gpsService.position.coords.longitude - 0.001,
                    }
                },

            ];
        },
        whenClick: function(el, data) {
            console.log('activity started');
        },
        assets: async function() {
            // TODO: Rewrite using Rxjs
            const d = await getData();
            const assets = await assetService.getData();

            const dir = this.compass();
            dir.forEach(element => {
                d.push(element);
            });
           
            this.assetArray = d.map(p => {
                return {
                    geometry: p.geometry,
                    value: p.value,
                    scale: p.scale,
                    position: p.position,
                    entityPos: `latitude: ${p.position.lat}; longitude: ${p.position.lon};`,
                    conversation: `id: ${p.conversationId}`
                };
            });

            console.log('data collected', this.assetArray);
        }
    },
    computed: {
        pos: function() {
            console.log('position in pos', gpsService.position);
            const pos = `latitude: ${gpsService.position.coords.latitude}; longitude: ${gpsService.position.coords.longitude};`;
            return pos;
        },
        loading: function() {

            if (!gpsService.position
                || this.assetArray.length === 0)
                this.loadingState = true;
            else
                this.loadingState = false;
            
            return this.loadingState;
        }
    },
    data: function() {
        return {
           loadingState: true,
           assetArray: []
        }
    },
    template: `
        <div>
            <template v-if="loading">
                <div>loading...</div>
                <div>{{pos}}</div>
                <div>{{assetArray}}</div>
            </template>
            <template v-if="!loading">
                <a-scene ar vr-mode-ui="enabled: false" embedded arjs="sourceType: webcam; debugUIEnabled: false;">
                <!--<a-scene ar vr-mode-ui="enabled: false" embedded arjs="sourceType: webcam; debugUIEnabled: false;">-->
           
            
                    <template v-for="asset in assetArray">
                        <template v-if="asset.geometry == 'text'">
                            <a-text v-bind:value="asset.value" look-at="[gps-camera]" v-bind:scale="asset.scale" v-bind:gps-entity-place="asset.entityPos" v-bind:start-conversation="asset.conversation"></a-text>
                        </template>
                    </template>

                    <a-sphere position="2 1.25 -5" radius="1.25" color="#EF2D5E" start-conversation="id: 1"></a-sphere>

            <!--
                    <a-sphere position="2 1.25 -5" radius="1.25" color="#EF2D5E" 
                    event-set__down="_event: mousedown; color: #8FF7FF"
                    event-set__up="_event: mouseup; color: #4CC3D9"></a-sphere>
            -->

                    <a-text v-bind:value="assetArray.length" look-at="[gps-camera]" scale="40 40 40" gps-entity-place="latitude: 59.292531; longitude: 18.050466;"></a-text>
            <!--                    <a-text value="B" scale="100 100 100" gps-entity-place="latitude: 59.293000; longitude: 18.050500;"></a-text>
                    <a-text value="C" look-at="[gps-camera]" scale="2000 2000 2000" gps-entity-place="latitude: 59.292631; longitude: 18.050566;"></a-text>
            -->
            
                    <a-camera gps-camera rotation-reader>
                        <a-cursor></a-cursor>
                    </a-camera>
                </a-scene>
            </template>
    
        </div>
    `
});



